# Banking apps


Banking apps is a set of services that allows business user to :

- create/update/delete a company
- calculate loan score using kogito DMN services or streaming process service (reactive messaging)
- simulate loan validation process service 



The following architecture deployed on Openshift,is composed by 
 - mongodb instance to store company and scoring details
 - quarkus, panache services to manage CRUD companies and scoring operations (Rest operations)
 - quarkus, kogito service to calculate the score. the service offer differents ways to caclulate score :
    - DMN rest service 
    - event process (using kafka)
 - quarkus, kogito service to simulate a loan validation process. the communication between the process use reactive messaging, all objects are stored in infinispan.
- frontend to manage all services
- all services offers rest api

![Archi](img/archi-fonctionnelle-bbank-apps-loan.png) 

##
install :
- oc cli
- kn cli
- kogito cli

## connect to Openshift server 

```
oc login https://ocp-url:6443 -u login -p password
```

## create new namespace
```
oc new-project bbank-apps
```

## add a github secret to checkout sources 

```
oc create secret generic username \
    --from-literal=username=username \
    --from-literal=password=password \
    --type=kubernetes.io/basic-auth
```

## add a registry secret

```
oc create secret docker-registry quay-secret \
    --docker-server=quay.io/username \
    --docker-username=username \
    --docker-password=password\
    --docker-email=email

oc secrets link builder quay-secret
oc secrets link default quay-secret --for=pull
```

## Clone the source from github
```
git clone https://github.com/mouachan/bbank-apps.git

```

## Create MongoDB instance on OCP

## Create a persistent mongodb 

From Openshift Developper view, click on Add,select Database

![Add database app](/img/catalog-db-ocp.png) 

From the developer catalog, click on MongoDB Template (persistent)

![Developer catalog](/img/developer-catalog.png) 

Click on Instantiate Template (use the filled values)

![Instantiate the template](/img/instantiate-template-mongodb.png) 



## Build and deploy companies services managment (create/update/delete company and score)

## Create  DB and collection
Get mongo pod name
```
oc get pods    

NAME               READY   STATUS      RESTARTS   AGE
mongodb-1-deploy   0/1     Completed   0          40s
mongodb-1-g4mwf    1/1     Running     0          35s
```

Create the schema 
```
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < manifest/create-schema.js  
```
add records
```
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < manifest/insert-records.js  
```


## Install knative-serving (serverless)
Install openshift-serverless operator from OperatorHub

Create a knative-serving instance
```
./manifest/knative-serving.sh
```

## Build and deploy companies CRUD services

delete the services if exist
```
oc delete all,configmap,pvc,serviceaccount,rolebinding --selector app=companies-svc
```
## way 2 : source to image build  (S2I)
```
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:20.1.0-java11~https://github.com/mouachan/banking-apps.git \
--name=companies-svc \
--context-dir=bbank-apps/companies-svc \
-e MONGODB_SERVICE_HOST=mongodb \
-e MONGODB_SERVICE_PORT=27017 \
--source-secret=github
```

## way 2 :  build the container locally and push to the registry (java or native)) 
```
cd companies-svc
```

java
```
cd ../companies-svc
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=1.0
docker tag mouachani/companies-svc:1.0 quay.io/mouachan/companies-svc:1.0
docker push quay.io/mouachan/companies-svc:1.0
```

native 
```
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=native-1.0 -Pnative  -Dquarkus.native.container-build=true 
docker tag mouachani/companies-svc:native-1.0 quay.io/mouachan/bbank-apps/companies-svc:native-1.0
docker push quay.io/mouachan/bbank-apps/companies-svc:native-1.0 
```

deploy a knative service 
java
```
oc apply -f ../manifest/companies-svc-knative.yml 
```
native
```
oc apply -f ../manifest/companies-svc-native-knative.yml 
```

## verify the service availability
Browse the url  : http://companies-svc-bbank-apps.apps.ocp4.ouachani.net/
replace .apps.ocp4.ouachani.net by your OCP url

![Verify service](/img/list-companies.png)


## Install Strimzi, infinispan and kogito operator

Install Infinispan/Red Hat Data Grid operator (operator version 1.1.X)
![infinispan installation](/img/install-infinispan-11x.png)
Install Strimizi operator
![strimzi installation](/img/install-strimzi.png)
Install Kogito operator
![strimzi installation](/img/install-kogito.png)

## Install kogit-infra 

```
kogito install infinispan
kogito install kafka
```

Install data-index

```
kogito install data-index
```

Add protobuf models of process loanValidation, processNotation and kogitoApp

```
oc apply -f ./manifest/data-index-protobuf-files.yml
```
Get username and password infinispan and decode it

```
oc get secret/kogito-infinispan-credential -o yaml
echo ZGV2ZWxvcGVy | base64 -d
```

Modify the values of the properties host/port to the  kafka, infinispan, data-index and companies-svc services in ./manifest/*-cm.yml also infinispan credential :
```
 #rest client 
    org.redhat.bbank.eligibility.rest.CompaniesRemoteService/mp-rest/url=companies-svc
    org.redhat.bbank.eligibility.rest.CompaniesRemoteService/mp-rest/scope=javax.enterprise.context.ApplicationScoped
    
    #infinispan 
    quarkus.infinispan-client.sasl-mechanism=PLAIN
    quarkus.infinispan-client.server-list=kogito-infinispan:11222
    quarkus.infinispan-client.auth-username=developer
    quarkus.infinispan-client.auth-password=jPBNvQ2uqg@xJ6Pd%

    # kafka eligibility service 
    kafka.bootstrap.servers=kogito-kafka-kafka-bootstrap.bbank-apps.svc:9092
```
Create the config map
```
oc apply -f ./manifest/properties/eligibilitty-properties-cm.yml
oc apply -f ./manifest/protobuf/eligibilitty-protobuf-files.yml

oc apply -f ./manifest/properties/notation-properties-cm.yml
oc apply -f ./manifest/protobuf/computeNotation-protobuf-files.yml

oc apply -f ./manifest/properties/loan-properties-cm.yml
oc apply -f ./manifest/protobuf/loanValidation-protobuf-files.yml 
oc apply -f ./manifest/protobuf/callnotation-protobuf-files.yml
```

create  eligibility, notation, loan services
```
kogito deploy-service eligibility --enable-persistence --enable-events 
kogito deploy-service notation --enable-persistence --enable-events 
```

Package and start build
```
cd ../eligibility
./mvnw clean package -DskipTests=true -Dquarkus.container-image.build=true -Dquarkus.container-image.name=eligibility -Dquarkus.container-image.tag=1.0 -Dquarkus.container-image.builder=s2i
oc start-build eligibility --from-dir=target -n bbank-apps 

cd ../notation
./mvnw clean package -DskipTests=true -Dquarkus.container-image.build=true -Dquarkus.container-image.name=notation -Dquarkus.container-image.tag=1.0 -Dquarkus.container-image.builder=s2i
oc start-build notation --from-dir=target -n bbank-apps 

cd ../loan
./mvnw clean package -DskipTests=true -Dquarkus.container-image.build=true -Dquarkus.container-image.name=loan -Dquarkus.container-image.tag=1.0 -Dquarkus.container-image.builder=s2i
oc start-build loan --from-dir=target -n bbank-apps 

```


....To be continued (build and deploy frontend / test the app)
