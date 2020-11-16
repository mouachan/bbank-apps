# ![BBank Logo](./img/logo.png) 

# how to makes Business Users happy !

As a developper, we always have in mind the same question « What if we could avoid a long meeting with business users ? What if we could let them design the business case and just plug in and play with the other element : build, secure, deploy  and monitor the app ! »

And the same thing for operational guys : « … I wasted my morning, always same gibberish
Kafka, Streaming , API. They also said something about rolling out in 2 weeks the new feature because of I don’t know what !!! Why can’t I update my scoring rule in real time ??? » 

Throw this story, we will show how we can easily build, secure and deploy a functional core created by business users.

My story is about « loan validation », which is how to simulate a loan for a company. 


What’s a loan approval ?

“The applicant” - a company - requests a loan, the system retrieves the request and starts the “loan process” orchestrator.
Then the “loan process” invokes the “eligibility process” to find out whether the applicant can be scored or not.
If so, the “loan process” invokes the “scoring process” to calculate a Rating which is a structure composed of a calculated Score, a Note (can be A, B, C or D), and a Guidance (can be “Approved” “Reserve”, “To review” or “Disapproved”).
Finally, the « loan process » makes an offer for
« The applicant », which is composed of a credit rate and a term (for example 2% and 36 months).

If the guidance is "To review", the decision to accept or refuse the requet must be approved by 2 level of managers (agency and regional). 


Clear ? Yes ? If not,  maybe the following diagram will gives more clarity on the orchestration between services. 

![Archi](./img/archi-fonctionnelle-bbank-apps-loan.png) 

Let’s go deeper on each service :

- companies-svc service : CRUD services to manage companies on a repository (mongodb) 
- eligibility service : evaluate the eligibility of a company to have a loan throw business rules
![eligibility](./img/eligibility.png) 
- notation service : calculate a score and note throw a process and business rules 
![notation](./img/notation.png) 
- loan service : manage the orchestration between business services 
![loan](./img/loan.png) 
![sub-process](./img/loan-sub-process.png) 

We have finished with the functional stuff :)

*From technical perspective, what we need ?*

 - datalake store : a mongodb instance to store company and scoring details
 - manage CRUD operation : a microservice based on quarkus, panache to manage CRUD companies and scoring operations (Rest)
 - eligibility, notation and loan services : a quarkus/kogito services to evaluate the eligibility, calculate the rating and orchestrate calls between services
 - a beautiful UI : a nodejs/react web UI to simulate the loan
 - a monitoring service : functional dashboard based on Prometheus and Grafana 
 - secure services : an SSO such as Keycloak 
 - event messaging : Kafka to manage events throws processes/services 
 - events cache : infinispan cache to manage the events store (which can give the chronology of the execution of the process for example)
 - Serverless : Knative makes the service scalable when needed, it only starts the service if the application receives a request 

all services expose rest api, the processes use reactive messaging (kafka) to consume/push events, all events are stored in infinispan.

## What’s the benefits of such architecture ?
I took some quotes from [Kogito](_https://kogito.kie.org/_) because I found it realistic !
  
For Business Users

Thanks to Kogito : Stay focused on what the business is about instead of being concerned with technology behind it.
Kogito adopts to your business domain rather than the other way around. 

API First

Thanks to Quarkus/ Kogito : all api are generated throw both frameworks. 
No more leaking abstraction of the tool into your client applications.

Super Fast and Cloud Ready

If you think about business automation think about the cloud as this is where your business logic lives these days. By taking advantage of the latest technologies (Quarkus, knative, etc.), you get amazingly fast boot times and instant scaling on orchestration platforms like Kubernetes.
 
Having Fun

At first you will be angry, then sad,  and …. you will break your laptop. In the end you will be happy because it works like magic ! 

Ready ? Hands On :)

## to deploy the apps localy

https://github.com/mouachan/bbank/tree/master/docker-compose

## to deploy  the apps on openshift
Please install : 
- oc cli : https://docs.openshift.com/container-platform/4.5/cli_reference/openshift_cli/getting-started-cli.html
- kn cli : https://docs.openshift.com/container-platform/4.5/serverless/installing_serverless/installing-kn.html#installing-kn
- kogito cli : https://docs.jboss.org/kogito/release/latest/html_single/#proc-kogito-operator-and-cli-installing_kogito-deploying-on-openshift

### connect to Openshift server

```shell
oc login https://ocp-url:6443 -u login -p password
```



### create new namespace
```shell
oc new-project bbank
```
Routes include the project name, if you choose another one, don't forget to change it on the differents places/files (such kogito-realm) to use the correct urls. 
### add a github secret to checkout sources

```shell
oc create secret generic username \
    --from-literal=username=username \
    --from-literal=password=password \
    --type=kubernetes.io/basic-auth
```

### add a registry secret to build pull images from quay

``` shell
oc create secret docker-registry quay-secret \
    --docker-server=quay.io/username \
    --docker-username=username \
    --docker-password=password\
    --docker-email=email

oc secrets link builder quay-secret
oc secrets link default quay-secret --for=pull
```

### Clone the source from github

```git
git clone -b v2 https://github.com/mouachan/bbank-apps.git
```


### Install RHSSO Operator
Navigate to the OLM Web Console to navigate to the RHSSO Operator using menu on the left side and following Operators → OperatorHub. Then, focus on the search input box and type « rhsso »  : 

![RHSSO Operator HUB](./img/rhsso-ohub.png) 

Next, navigate to RHSSO Operator and click on it. Next, follow the instructions on the screen. Make sure you’ve chosen « bank » namespace when selecting the Subscription in the next screen.

### Create RHSSO instance using RHSSO Operator

Once RHSSO Operator is subscribed to a « bank », you can install a RHSSO installation by creating a RHSSO Custom Resource:

```shell
oc apply -f ./manifest/services/bbank-sso-instance.yml
```

After a few minutes, Keycloak cluster should be up and running. Once the RHSSO instance is created, check if it’s ready:

```shell
oc get keycloak bbank-sso -o jsonpath=‘{.status.ready}’
true
```

### Create Keycloak Realm

Get the RHSSO credential secret name
```shell
oc get secret | grep bbank-sso
credential-bbank-sso                           Opaque
```

Get the login/password
```shell
oc get secret credential-bbank-sso -o go-template='{{range $k,$v := .data}}{{printf "%s: " $k}}{{if not $v}}{{$v}}{{else}}{{$v | base64decode}}{{end}}{{"\n"}}{{end}}'
```

Get the RHSSO route
```shell
oc get route | grep keycloak
keycloak        keycloak-bbankapps.apps.ocp4.ouachani.org               keycloak        keycloak   reencrypt     None
```
before to create the realm, if you use another namespace name, you must change all the urls used by the clients in the ./manifest/services/kogito-realm.json or from the administration console after the realm creation. 

Access to the administration console as a admin (use the credential)
Click on  "add realm" 
![add realm](./img/rhsso-add-relam.png)  
Click on "Select file" (use the file ./manifest/services/kogito-realm.json)

import the realm from ./manifest/services/bbank-realm.json
![import kogito realm](./img/rhsso-import-realm.png)  

It will create a realm "kogito", clients, users and credentials.



### Create a persistent mongodb

#### Option 1 : using oc cli

```shell
#check if persistent mongo exist

oc get templates -n openshift | grep mongodb

#get paramters list
oc process --parameters -n openshift mongodb-persistent

#create the instannce
oc process mongodb-persistent -n openshift -p MONGODB_USER=admcomp -p MONGODB_PASSWORD=r3dhat2020! -p MONGODB_DATABASE=companies -p MONGODB_ADMIN_PASSWORD=r3dhat2020! \
| oc create -f -
```

#### Option 2: using Openshift UI
From Developer view, click on Add,select Database

![Add database app](./img/catalog-db-ocp.png) 

From the developer catalog, click on MongoDB Template (persistent)

![Developer catalog](./img/developer-catalog.png) 

Click on Instantiate Template (use the filled values)

![Instantiate the template](./img/instantiate-template-mongodb.png) 

### Build the Loan Model

```shell
cd model
mvn clean install
```


### Build and deploy companies services management

####  Create  DB and collection

Get mongo pod name
```shell
oc get pods    

NAME               READY   STATUS      RESTARTS   AGE
mongodb-1-deploy   0/1     Completed   0          40s
mongodb-1-g4mwf    1/1     Running     0          35s
```

Create the schema 
```shell
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ./manifest/scripts/create-schema.js  
```
add records
```shell
oc exec -it mongodb-1-g4mwf -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ./manifest/scripts/insert-records.js  
```


#### Install knative-serving (serverless)

Install openshift-serverless operator from OperatorHub

Create a knative-serving instance
```shell
./manifest/scripts/knative-serving.sh
```

#### Build and deploy serverless companies CRUD services

delete the services if exist
```shell
oc delete all,configmap,pvc,serviceaccount,rolebinding --selector app=companies-svc
```
##### option 1 : source to image native build (S2I)
The native build consume a lot of ressources 

```shell
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:20.1.0-java11~https://github.com/mouachan/bbank-apps.git \
--name=companies-svc \
--context-dir=companies-svc \
-e MONGODB_SERVICE_HOST=mongodb \
-e MONGODB_SERVICE_PORT=27017 \
--source-secret=github
```

##### option 2 :  build the container locally and push to the registry (java or native)
```shell
cd ../companies-svc
```

java
```shell
cd ../companies-svc
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=1.0
docker tag mouachani/companies-svc:1.0 quay.io/mouachan/companies-svc:1.0
docker push quay.io/mouachan/companies-svc:1.0
```

native 
```shell
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=native-1.0 -Pnative  -Dquarkus.native.container-build=true 
docker tag mouachani/companies-svc:native-1.0 quay.io/mouachan/companies-svc:native-1.0
docker push quay.io/mouachan/companies-svc:native-1.0 
```

deploy a knative service 
java
```shell
oc apply -f ../manifest/services/companies-svc-knative.yml 
```
native
```shell
oc apply -f ../manifest/services/companies-svc-native-knative.yml 
```

#### verify the service availability
Get route
```shell                                                                                                                                                                            
oc get routes.serving.knative.dev  | grep companies
companies-svc   companies-svc-bbank.apps.ocp4.ouachani.org          true
```

Browse the url  : http://companies-svc-bbank.apps.ocp4.ouachani.org/

![Verify service](./img/list-companies.png) 

### Build and deploy the services

#### Install Strimzi, infinispan and kogito operator

Install Infinispan/Red Hat Data Grid operator (operator version 1.1.X)
![infinispan installation](./img/install-infinispan-11x.png) 
Install Strimizi operator
![strimzi installation](./img/install-strimzi.png) 
Install Kogito operator
![strimzi installation](./img/install-kogito.png) 

#### Install data-index e.g the kogito-infra (kogito v0.17)

```shell
kogito install infra infinispan --kind Infinispan --apiVersion infinispan.org/v1
kogito install infra kafka --kind Kafka --apiVersion kafka.strimzi.io/v1beta1
```

This infra, will manage kafka topics and infinispan cache ! That’s one of the magic kogito I prefer, no need to worry about it. Kogito Operator will take care on topics/caches for us !

Sure there is a magic, but it needs a little configuration. Infinispan, needs the models/processes to store all actions done by the process. Below an exemple :

```protobuf
syntax = "proto2"; 
package org.kie.kogito.app; 
import "kogito-types.proto";

message Bilan { 
    option java_package = "org.redhat.bbank.model";
    optional double dl = 1; 
    optional double ee = 2; 
    optional double fl = 3; 
    optional double fm = 4; 
    optional double ga = 5; 
    optional double gg = 6; 
    optional double hn = 7; 
    optional double hp = 8; 
    optional double hq = 9; 
    optional string siren = 10; 
    repeated Variable variables = 11; 
}
message Notation { 
    option java_package = "org.redhat.bbank.model";
    optional double decoupageSectoriel = 1; 
    optional string note = 2; 
    optional string orientation = 3; 
    optional double score = 4; 
    optional string typeAiguillage = 5; 
}
message Variable { 
    option java_package = "org.redhat.bbank.model";
    optional string type = 1; 
    optional double value = 2; 
}
```


 You can find those files (generated by kogito when you build the services) in /target/classes/persistence directory. So, I create a configmap containing all protobuf models of processes : eligibility, notation, loan and data-index for you. Let’s just apply it on Openshift :

```shell
oc apply -f ./manifest/protobuf/data-index-protobuf-files.yml
```

create a data-index service

``` shell
kogito install data-index --infra kafka --infra infinispan
```

We need the infinispan username and password

```shell
oc get secret kogito-infinispan-credential -o go-template='{{range $k,$v := .data}}{{printf "%s: " $k}}{{if not $v}}{{$v}}{{else}}{{$v | base64decode}}{{end}}{{"\n"}}{{end}}'
password: ########
username: developer
```

As I said we don’t need to manage the caches and topics, but we need to specify to Kogito services the kafka and infinispan properties to reach them.

Modify the values of the properties values of host/port/credential of  kafka, infinispan, data-index , companies-svc services in ./manifest/*-cm.yml  :

```properties
 #rest client 
    org.redhat.bbank.eligibility.rest.CompaniesRemoteService/mp-rest/url=companies-svc
    org.redhat.bbank.eligibility.rest.CompaniesRemoteService/mp-rest/scope=javax.enterprise.context.ApplicationScoped
    
    #infinispan 
    quarkus.infinispan-client.sasl-mechanism=PLAIN
    quarkus.infinispan-client.server-list=kogito-infinispan:11222
    quarkus.infinispan-client.auth-username=developer
    quarkus.infinispan-client.auth-password=jPBNvQ2uqg@xJ6Pd%

    # kafka eligibility service 
    kafka.bootstrap.servers=kogito-kafka-kafka-bootstrap.bbank.svc:9092
```

Create the protobuf  and services properties config maps that’s allow to data-index to load all protobufs and to loan, eligibility, notation services to load their infra properties 

```shell
oc apply -f ./manifest/properties/eligibility-properties-cm.yml
oc apply -f ./manifest/protobuf/eligibility-protobuf-files.yml

oc apply -f ./manifest/properties/notation-properties-cm.yml
oc apply -f ./manifest/protobuf/notation-protobuf-files.yml

oc apply -f ./manifest/properties/loan-properties-cm.yml
oc apply -f ./manifest/protobuf/loan-protobuf-files.yml 
```

create  « eligibility, notation, loan » - kogito - services
``` shell
oc apply -f ./manifest/services/eligibility-kogitoapp.yml
oc apply -f ./manifest/services/notation-kogitoapp.yml
oc apply -f ./manifest/services/loan-kogitoapp.yml
```

Package and start the build
```java
cd eligibility
mvn clean package -DskipTests=true 
oc start-build eligibility --from-dir=target -n bbank 

cd ../notation
mvn clean package -DskipTests=true 
oc start-build notation --from-dir=target -n bbank 

cd ../loan
./mvnw clean package -DskipTests=true 
oc start-build loan --from-dir=target -n bbank 

cd ..
```

From the kogito operator, create the management-console
![management console](./img/create-mgmt-console.png) 

We have to deploy the task console from code, it's not included on the management console, we have to create a kogito service based on the latest task-console jar file.
Get the file 

```shell
export TASK_CONSOLE_VERSION="0.17.0"
TASK_CONSOLE_RUNNER=https://search.maven.org/remotecontent?filepath=org/kie/kogito/task-console/${TASK_CONSOLE_VERSION}/task-console-${TASK_CONSOLE_VERSION}-runner.jar
wget -nc -O task-console-${TASK_CONSOLE_VERSION}-runner.jar ${TASK_CONSOLE_RUNNER}
oc apply -f manifest/properties/task-console-auth.yml
oc apply -f manifest/services/task-console.yml
oc start-build task-console --from-file=./task-console-0.17.0-runner.jar -n bbank
```

Get the task-console route
```shell
oc get route | grep task-console
task-console         task-console-bbankapps.apps.ocp4.ouachani.org                task-console         http                     None
```
you can access to the console using 2 users jdoe/jdoe or alice/alice
![task console](./img/task-console.png) 


## We are ready for tests, go find more people for help 😆

First get the route of the management console

```shell
oc get route management-console  
NAME                 HOST/PORT                                              PATH   SERVICES             PORT   TERMINATION   WILDCARD
management-console   management-console-bbank.apps.ocp4.ouachani.org          management-console   8080                 None 
```

Let's execute 3 different cases :


### Loan Refused 

```shell
curl -X POST "http://loan-bbankapps.apps.ocp4.ouachani.org/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":0,\"hq\":2,\"dl\":16,\"ee\":4,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":false,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
```

### Loan Approved with note A

```shell
curl -X POST "http://loan-bbank.apps.ocp4.ouachani.org/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":50,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
```


Open the management console (management-console-bbank.apps.ocp4.ouachani.org) , click on « Status »,  select « Completed » and click on « Apply filter » 

![Filter process](./img/filter-completed-process.png) 

![list of process](./img/list-process-mgmt-console.png) 

Click on loan Validation process

![process result](./img/process-details-result.png) 

The result is :

![notation](./img/calculated-notation-model-1.png) 

And the Offer details (Rate and number of months) 

![offer](./img/offer.png) 


### Loan to review, approval by managers, 2 different levels of approvals : Agency and Regional

```shell
curl -X POST "http://loan-bbank.apps.ocp4.ouachani.org/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":12,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
```
From management console, we can see that the process is waiting to approval from the agency
 ![process active ht](./img/process-active-ht.png) 

Click on the loanValidation process to get the details, see that is waiting for an approval
 ![agency approval in management console](./img/agency-approval-mgmt-console.png)

Access to the task inbox as the agency manager John (jdoe/jdoe)  
![task inbox jdoe](./img/agency-approval-jdoe-task-inbox.png)

Click on the human task "Agency approval" to get the form
![form agency approval](./img/form-agency-approval-jdoe.png)

Change the following values and click on complete
Note : A
Orientation : Approved
![complete task jdoe](./img/complete-task-jdoe.png)

Go back to the management console, refresh, you can see that the agency approval is done, and the process is waiting for a regional approval
![regional approval task mgmt-console](./img/regional-approval-mgmt-console.png)

Back to the task console, disconnect jdoe, and connect to the console as the regional manager Alice (alice/alice)
![regional approval task inbox for alice](./img/regional-approval-alice-task-inbox.png)
Click on the task, you will get the form. You can see that the new values are propagated to Alice for validation
![regional approval task inbox for alice](./img/form-regional-approval-alice.png)
Complete the task (click on Complete), go back to the managment console. The loan is approved
![Loan approved](./img/loan-approved-double-validation.png)  


## The UI

We validate that all services works fine, so let’s deploy the UI using nodejs S2I builder.  
 
I add some parameters to simplify the integration :

    - labels to easily manage the app
    
    - source-secret to pull the source from github
    
    - LOAN_VALIDATION_URL is used by the frontend to call « loan process »
    
    - GRAPHQL_URL is used by the frontend to get the result from infinispan by using graphql queries
    
    - name : to name the application

```shell
oc new-app nodejs:12~http://github.com/mouachan/bbank-apps#v2 --context-dir=/bbank-ui  -l 'name=bbank-ui,app=bbank-ui,app.kubernetes.io/component=bbank-ui,app.kubernetes.io/instance=bbank-ui,deployment=bbank-ui' --source-secret=github -e  LOAN_VALIDATION_URL="http://loan-bbank.apps.ocp4.ouachani.org/loanValidation" -e   GRAPHQL_URL="http://data-index-bbank.apps.ocp4.ouachani.org/graphql"  --name=bbank-ui -n bbank
```

Get the route

```shell
oc get route bbank-ui 
NAME       HOST/PORT                                    PATH   SERVICES   PORT       TERMINATION   WILDCARD
bbank-ui   bbank-ui-bbank.apps.ocp4.ouachani.org          bbank-ui   8080-tcp                 None
```

If you click on submit using the filled values the result is an approved loan
![frontend](./img/loan-validation-ui.png) 

Result
![Result](./img/result.png) 


##  Business Users will love you
The most things that matter to Business Users is to track business metrics, meaning display the business metrics on a wonderful dashboard.

The good point is : you don’t have anything to do :) 
 Kogito listener will track result and expose it as metrics.

```java
public class LoanPrometheusProcessEventListener extends PrometheusProcessEventListener {
    
    protected final Counter numberOfLoanApplicationsApproved = Counter.build()
            .name("loan_approved_total")
            .help("Approved loan applications")
            .labelNames("app_id","note", "score","rate","months" )
            .register();
    
    protected final Counter numberOfLoanApplicationsRejected = Counter.build()
            .name("loan_rejected_total")
            .help("Rejected loan applications")
            .labelNames("app_id", "reason")
            .register();

    private String identifier;
    
    public LoanPrometheusProcessEventListener(String identifier) {
        super(identifier);
        this.identifier = identifier;
    }
    
    public void cleanup() {
        CollectorRegistry.defaultRegistry.unregister(numberOfLoanApplicationsApproved);
        CollectorRegistry.defaultRegistry.unregister(numberOfLoanApplicationsRejected);
    }

    @Override
    public void afterProcessCompleted(ProcessCompletedEvent event) {
        super.afterProcessCompleted(event);
        final WorkflowProcessInstanceImpl processInstance = (WorkflowProcessInstanceImpl) event.getProcessInstance();
        if (processInstance.getProcessId().equals("loanValidation")) {
            Loan application = (Loan) processInstance.getVariable("loan");
        
            if (application.isEligible()) {
                numberOfLoanApplicationsApproved.labels(identifier, safeValue(application.getNotation().getNote()), String.valueOf(application.getNotation().getScore()), safeValue(String.valueOf(application.getRate())), safeValue(String.valueOf(application.getNbmonths()))).inc();
            } else {
                numberOfLoanApplicationsRejected.labels(identifier, safeValue(application.getMsg())).inc();
            }
        
        }
    }

    protected String safeValue(String value) {
        if (value == null) {
            return "unknown";
        }       
        return value;
    }
}
```

Metrics exposed, let’s install Prometheus and Grafana to catch metrics and show the dashboard

### Prometheus Operator

Install Prometheus operator throw Openshift OperatorHub 

Change "bbank" by your namespace name (namespace, matchNames and app properties) in the following files :
- ./manifest/services/prometheus-config.yml
- ./manifest/services/prometheus-services-monitor.yml
- ./manifest/services/grafana-instance.yml 
- ./manifest/services/grafana-prometheus-data-source.yml
- ./manifest/services/grafana-loan-dashboard.yml

Configure prometheus

```shell yaml
oc apply -f ./manifest/services/prometheus-config.yml
```

Create prometheus instance

```shell
oc apply -f ./manifest/services/prometheus-instance.yml 
```

Expose service

```shell
oc expose svc prometheus
```


add Service Monitor

```shell
oc apply -f ./manifest/services/prometheus-services-monitor.yml
```

Install Grafana operator Openshift OperatorHub

create instance 

```shell
oc apply -f ./manifest/services/grafana-instance.yml
```
add prometheus data-source

```shell
oc apply -f ./manifest/services/grafana-prometheus-data-source.yml
```

add the Loan Dashboard

```shell
oc apply -f ./manifest/services/grafana-loan-dashboard.yml
```

Get grafana route

```shell
oc get route | grep grafana 
grafana-route        grafana-route-bbank.apps.ocp4.ouachani.org               grafana-service      3000   edge          None
```

Go to  http://grafana-route-bbank.apps.ocp4.ouachani.org, you will see the metrics :

![Dashboard](./img/dashboard-grafana.png) 


