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
oc apply -f manifest/services/keventing/broker.yml
```
Add the event-display service to follow the cloud native events 
```shell
oc apply -f manifest/services/keventing/event-display-service.yml
```
Any event that matches the event-type of the notation service start node in the Broker is sent to notation service
```shell
oc apply -f manifest/services/keventing/notation-trigger-consumer.yml
```
Any cloud event produced by notation service is delivred to the broker
```shell
oc apply -f manifest/services/keventing/notation-sinkbinding.yml
```
Add a trigger to catch calculated event and subscribe the event-display to the type of the event
```shell
oc apply -f manifest/services/keventing/model1-event-display-trigger.yml
```

### Build the Loan Model

```shell
cd model
mvn clean install
```

### deploy kogito infra and notation service

#### Install Strimzi, infinispan and kogito operator

Install Infinispan/Red Hat Data Grid operator (operator version 2.0.56)
![infinispan installation](./img/install-infinispan-11x.png) 
Install Strimizi operator
![strimzi installation](./img/install-strimzi.png) 
Install Kogito operator
![strimzi installation](./img/install-kogito.png) 

#### Install data-index e.g the kogito-infra 

Deploy the kogito infra (infinispan, kafka and knative eventing)
```shell
kogito install infra kogito-infinispan-infra --kind Infinispan --apiVersion infinispan.org/v1 -p $PROJECT
kogito install infra kogito-kafka-infra --kind Kafka --apiVersion kafka.strimzi.io/v1beta1 -p $PROJECT
oc apply -f ./manifest/services/keventing/kogito-knative-infra.yml -n $PROJECT

```
create a data-index service

``` shell
kogito install data-index --infra kogito-infinispan-infra --infra kogito-kafka-infra -p $PROJECT 
```

Get the generated data-index configmap and add the infinispan client-intelligence property (quarkus.infinispan-client.client-intelligence=BASIC)

``` shell
oc get cm data-index-properties -o jsonpath='{.data.application\.properties}' >> ./$TMP_DIR/application.properties
echo "quarkus.infinispan-client.client-intelligence=BASIC" >> ./$TMP_DIR/application.properties
oc create configmap data-index-properties --from-file=./$TMP_DIR/application.properties --dry-run -o yaml | oc apply -f 
rm application.properties
```

This infra, will manage kafka topics and infinispan cache ! That’s one of the magic kogito I prefer, no need to worry about it. Kogito Operator will take care on topics/caches for us !

For each kogito service created, the Kogito operator will generate a configmap name nameofservice-protobuf-files that contains the protobuf of the models/processes to store all actions done by the process. 

You can find the generated protobuf in /target/classes/persistence directory of each service.

When the service is created with the property --infra, kogito operator will generate the configuration to connect to infinispan/kafka in (including the secrets), the name  

Deploy and configure notation service
 
``` shell
#create the service throw kogito operator (change the image registry by your own)
oc apply -f ./manifest/services/keventing/notation-kogito-runtime.yml
cd notation
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=notation -Dquarkus.container-image.tag=1.0 -DskipTests=true
docker tag mouachani/notation:1.0 quay.io/mouachan/notation:1.0
docker push quay.io/mouachan/notation:1.0
```
Configure notation properties

``` shell
cd ..
NOTATION_URL=$(oc get route notation --output=jsonpath={..spec.host})
echo $NOTATION_URL
cat ./manifest/properties/notation.properties >> ./$TMP_DIR/application.properties
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g ./$TMP_DIR/application.properties
sed  -i "" s~NOTATION_URL~${NOTATION_URL}~g ./$TMP_DIR/application.properties
oc get cm notation-properties -o jsonpath='{.data.application\.properties}' >> ./$TMP_DIR/application.properties
oc create configmap notation-properties --from-file=./$TMP_DIR/application.properties --dry-run -o yaml | oc apply -f -
rm ./$TMP_DIR/application.properties
```



## We are ready for tests, go find more people for help 😆

### Note A
```shell
curl -X POST \                                                     08:47:20
-H "content-type: application/json"  \
-H "ce-specversion: 1.0"  \
-H "ce-source: /from/localhost"  \
-H "ce-type: noteapplication" \
-H "ce-id: 12346"  \
-d '{"gg":5,"ga":2,"hp":1,"hq":2,"dl":50,"ee":2,"siren":"423646512","variables":[]}' \
http://notation-bbankapps-kevent.apps.cluster-e80d.e80d.example.opentlc.com
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

As you can see the event-display service is triggered  :  ##{"score":0.0,"note":"A","orientation":"Approved","decoupageSectoriel":1.0,"typeAiguillage":"MODELE_1"}##
