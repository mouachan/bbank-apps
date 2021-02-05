# ![BBank Logo](./img/logo.png) 


## to deploy the apps localy

https://github.com/mouachan/bbank-apps/tree/1.0.x-infinispan/docker-compose

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
export PROJECT=bbankapps-kevent
oc new-project $PROJECT
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

oc secrets link builder quay-secret -n $PROJECT
oc secrets link default quay-secret --for=pull -n $PROJECT
```

### Clone the source from github

```git
git clone -b 1.0.x-knative https://github.com/mouachan/bbank-apps.git cd bbank-apps
export TMP_DIR=tmp
mkdir $TMP_DIR
```

#### Install Openshift Serverless and knative-serving 

Install openshift-serverless operator from OperatorHub

https://docs.openshift.com/container-platform/4.6/serverless/installing_serverless/installing-openshift-serverless.html

Create a knative-serving and knative-eventing instance
```shell
./manifest/scripts/knative-serving.sh
./manifest/scripts/knative-eventing.sh
```

Create the knative bkoker
```shell
oc apply -f manifest/services/keventing/infra/broker.yml
```
Add the event-display service to follow the cloud native events 
```shell
oc apply -f manifest/services/keventing/kogito-service/event-display-service.yml
```



### Build the Loan Model

```shell
cd model
mvn clean install
```

### deploy kogito infra and notation service

#### Install Kogito operator

Install Kogito operator
![strimzi installation](./img/install-kogito.png) 

#### Install the kogito-infra 

* deploy the kogito infra 
```shell
cd ..
oc apply -f ./manifest/services/keventing/infra/kogito-knative-infra.yml -n $PROJECT
```

* deploy eligibility/notation service

``` shell
#create the service throw kogito operator 
oc apply -f ./manifest/services/keventing/kogito-service/eligibility-kogitoapp.yml
cd notation
mvn clean package  -DskipTests=true
oc start-build eligibility --from-dir=target 
```
 
```shell
#create the service throw kogito operator 
cd ../notation
oc apply -f ../manifest/services/keventing/kogito-service/notation-kogitoapp.yml
mvn clean package  -DskipTests=true
oc start-build notation --from-dir=target 
```

* deploy event-display trigger
```shell
oc apply -f ../manifest/services/keventing/trigger/eligible-event-display-trigger.yml
oc apply -f ../manifest/services/keventing/trigger/model1-event-display-trigger.yml
```

* deploy notation trigger (cloud event produced from eligbility should trigger the notation service ) <== not working yet
```shell
oc apply -f ../manifest/services/keventing/trigger/eligible-event-notation.yml
```


## We are ready for tests, 😆

### Note A
```shell
curl -X POST \                                                            18:29:06
-H "content-type: application/json"  \
-H "ce-specversion: 1.0"  \
-H "ce-source: /from/localhost"  \
-H "ce-type: process.eligibility.noteapplication" \
-H "ce-id: 12346"  \
-d "{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":50,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}" \
http://notation-bbankapps-keventing.apps.cluster-e80d.e80d.example.opentlc.com

```
Display the event catched by event-display
``` shell
oc logs -l serving.knative.dev/service=event-display -c user-container 
  id: 996a76c1-71eb-4da9-a614-ca8b77fee2e4
  time: 2021-02-01T18:18:36.59935Z
Extensions,
  knativearrivaltime: 2021-02-01T18:18:36.903100944Z
  knativehistory: default-kne-trigger-kn-channel.bbankapps-kevent.svc.cluster.local
  kogitoprocessid: computeNotation
  kogitoprocessinstanceid: 0ee5bee8-cfef-4506-ab67-81695c1d2e60
  kogitoprocessinstancestate: 1
Data,
  {"score":0.0,"note":"A","orientation":"Approved","decoupageSectoriel":1.0,"typeAiguillage":"MODELE_1"}
``` 

As you can see the event-display service is triggered  :  
* {"score":0.0,"note":"A","orientation":"Approved","decoupageSectoriel":1.0,"typeAiguillage":"MODELE_1"} *
