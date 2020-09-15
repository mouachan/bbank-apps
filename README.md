# bbank apps


bbank apps is a set of business services to simulate a company loan approval, the diagram describe the main flow :

![Archi](img/archi-fonctionnelle-bbank-apps-loan.png) 



- companies-svc service : create/update/delete companies in a repository (mongodb) 
- eligibility service : evaluate the eligibility of a company to have a loan throw business rules
![eligibility](img/eligibility.png) 
- notation service : calculate a score and note throw a process and business rules 
![notation](img/notation.png)
- loan service : manage the orchestration between business services 
![loan](img/loan.png)
![sub-process](img/loan-sub-process.png)



We will deploy 

 - a mongodb instance to store company and scoring details
 - companies-svc : a microservice based on quarkus, panache to manage CRUD companies and scoring operations (Rest)
 - eligibility : a quarkus/kogito service 
 - notation : a quarkus, kogito service 
 - loan : a quarkus, kogito service 
 - bbank-ui : a nodejs/react frontend to manage all services

All services expose rest api, the processes use reactive messaging (kafka) to consume/push events, all events are stored in infinispan.

## to deploy the apps localy follow the instructions

https://github.com/mouachan/bbank-apps/tree/master/docker-compose

## to deploy  the apps on openshift :
install 
- oc cli : https://docs.openshift.com/container-platform/4.5/cli_reference/openshift_cli/getting-started-cli.html
- kn cli : https://docs.openshift.com/container-platform/4.5/serverless/installing_serverless/installing-kn.html#installing-kn
- kogito cli : https://docs.jboss.org/kogito/release/latest/html_single/#proc-kogito-operator-and-cli-installing_kogito-deploying-on-openshift

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

Using oc cli
```
#check if persistent mongo exist

oc get templates -n openshift | grep mongodb

#get paramters list
oc process --parameters -n openshift mongodb-persistent

#create the instannce
oc process mongodb-persistent -n openshift -p MONGODB_USER=admcomp -p MONGODB_PASSWORD=r3dhat2020! -p MONGODB_DATABASE=companies -p MONGODB_ADMIN_PASSWORD=r3dhat2020! \
| oc create -f -
```

Or  Openshift UI
From Developper view, click on Add,select Database

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
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ./manifest/scripts/create-schema.js  
```
add records
```
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ./manifest/scripts/insert-records.js  
```


## Install knative-serving (serverless)
Install openshift-serverless operator from OperatorHub

Create a knative-serving instance
```
./manifest/scripts/knative-serving.sh
```

## Build and deploy companies CRUD services

delete the services if exist
```
oc delete all,configmap,pvc,serviceaccount,rolebinding --selector app=companies-svc
```
## way 1 : source to image build  (S2I)
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
docker tag mouachani/companies-svc:native-1.0 quay.io/mouachan/companies-svc:native-1.0
docker push quay.io/mouachan/companies-svc:native-1.0 
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
cd ..
oc apply -f ./manifest/services/data-index.yml
kogito install mgmt-console
```

Or using kogito cli
```
kogito install infinispan
kogito install kafka
kogito install mgmt-console
```

create configmap protobuf models of processes : eligibility, notation, loan  and data-index 

```
oc apply -f ./manifest/protobuf/data-index-protobuf-files.yml
```

Install data-index

```
kogito install data-index
```

Get username and password infinispan and decode it

```
oc get secret/kogito-infinispan-credential -o yaml | grep ' username: ' 
==> username: ZGV2ZWxvcGVy
echo ZGV2ZWxvcGVy | base64 -d
developer
oc get secret/kogito-infinispan-credential -o yaml | grep ' password: ' 
==>  password: V1M1bDJmZnA3RHVlbUYzcw==
echo V1M1bDJmZnA3RHVlbUYzcw== | base64 -d 
WS5l2ffp7DuemF3s
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
oc apply -f ./manifest/properties/eligibility-properties-cm.yml
oc apply -f ./manifest/protobuf/eligibility-protobuf-files.yml

oc apply -f ./manifest/properties/notation-properties-cm.yml
oc apply -f ./manifest/protobuf/notation-protobuf-files.yml

oc apply -f ./manifest/properties/loan-properties-cm.yml
oc apply -f ./manifest/protobuf/loan-protobuf-files.yml 
```

create  "eligibility, notation, loan" - kogito - services
```
kogito deploy-service eligibility --enable-persistence --enable-events 
kogito deploy-service notation --enable-persistence --enable-events 
kogito deploy-service loan --enable-persistence --enable-events 

```

Package and start build
```
cd eligibility
mvn clean package -DskipTests=true 
oc start-build eligibility --from-dir=target -n bbank-apps 

cd ../notation
mvn clean package -DskipTests=true 
oc start-build notation --from-dir=target -n bbank-apps 

cd ../loan
./mvnw clean package -DskipTests=true 
oc start-build loan --from-dir=target -n bbank-apps 
```

Test the processes

First get the route of the management console
```
oc get route management-console  
NAME                 HOST/PORT                                              PATH   SERVICES             PORT   TERMINATION   WILDCARD
management-console   management-console-bbank-apps.apps.ocp4.ouachani.org          management-console   8080                 None 
```

Run the process
```
curl -X POST "http://loan-bbank-apps.apps.ocp4.ouachani.org/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":50,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
```

Go to the management console route, click on "Status", select "Completed" and click on "Apply filter" 

![Filter process](/img/filter-completed-process.png)

![list of process](/img/list-process-mgmt-console.png)

Click on loan Validation process

![process result](/img/process-details-result.png)

Notation result is :

![notation](/img/calculated-notation-model-1.png)

Offer details (Rate and number of months) 

![offer](/img/offer.png)

