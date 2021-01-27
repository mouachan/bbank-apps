# ![BBank Logo](./img/logo.png) 

# how to makes Business Users happy !

## to deploy the apps localy

https://github.com/mouachan/bbank-apps/tree/1.0.x-mongo/docker-compose

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
export PROJECT=bbankapps-mongo
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

oc secrets link builder quay-secret
oc secrets link default quay-secret --for=pull
```

### Clone the source from github

```git
git clone -b 1.0.x-mongo https://github.com/mouachan/bbank-apps.git cd bbank-apps
export TMP_DIR=tmp
mkdir $TMP_DIR
```


### Install RHSSO Operator
Navigate to the OLM Web Console to navigate to the RHSSO Operator using menu on the left side and following Operators → OperatorHub. Then, focus on the search input box and type « rhsso »  : 

![RHSSO Operator HUB](./img/rhsso-ohub.png) 

Next, navigate to RHSSO Operator and click on it. Next, follow the instructions on the screen. Make sure you’ve chosen « bank » namespace when selecting the Subscription in the next screen.

### Create RHSSO instance using RHSSO Operator

Once RHSSO Operator is subscribed to a « bbank », you can install a RHSSO installation by creating a RHSSO Custom Resource:

```shell
oc apply -f ./manifest/services/rhsso/bbank-sso-instance.yml
```

After a few minutes, Keycloak cluster should be up and running. Once the RHSSO instance is created, check if it’s ready:

```shell
oc get keycloak bbank-sso -o jsonpath=‘{.status.ready}’
true
```

### Add kogito Realm

#### using oc cli
```shell
oc apply -f manifest/services/rhsso/bbank-sso-realm.yml
```
#### or manually (realm can be reset by the rhsso operator)

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
keycloak        keycloak-bbankapps-mongo.apps.ocp4.ouachani.org               keycloak        keycloak   reencrypt     None
```
before to create the realm, if you use another namespace name, you must change all the urls used by the clients in the ./manifest/services/kogito-realm.json or from the administration console after the realm creation. 

Access to the administration console as a admin (use the credential)
Click on  "add realm" 
![add realm](./img/rhsso-add-relam.png)  
Click on "Select file" (use the file ./manifest/services/kogito-realm.json)

import the realm from ./manifest/services/bbank-realm.json
![import kogito realm](./img/rhsso-import-realm.png)  

It will create a realm "kogito", clients, users and credentials.



### MongoDB

Some usefull links 
![Mongodb installation github](https://github.com/mongodb/mongodb-enterprise-kubernetes/blob/master/openshift-install.md)
![Mongodb installation documentation](https://docs.mongodb.com/kubernetes-operator/v1.8/installation/)
![Deploy Replicaset](https://docs.mongodb.com/kubernetes-operator/v1.8/tutorial/deploy-replica-set/)

#### Install using commandline
MongoDB builds the container images from the latest builds of the following operating systems:

    If you get your Kubernetes Operator from…	…the Container uses
    quay.io mongodb-enterprise-operator repository or GitHub	Ubuntu 16.04
    quay.io mongodb-enterprise-operator-ubi repository	Red Hat UBI 8
    OpenShift	

    Create a secret that contains credentials authorized to pull images from the registry.connect.redhat.com repository :
    If you have not already, obtain a Red Hat subscription.

    Create a Registry Service Account.

    Click on your Registry Service Account, then click the Docker Configuration tab.

    Download the <account-name>-auth.json file and open it in a text editor.

    Copy the registry.redhat.io object, and paste another instance of this object into the file. Remember to add a comma after the first object. Rename the second object registry.connect.redhat.com, then save the file:
    ```yaml
    {
    "auths": {
    "registry.redhat.io": {
        "auth": "<encoded-string>"
    },
    "auths": {
    "registry.connect.redhat.com": {
        "auth": "<encoded-string>"
    }
    }
    }
    ```
    Create a openshift-pull-secret.yaml file with the contents of the modified <account-name>-auth.json file as stringData named .dockerconfigjson:
    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
    name: openshift-pull-secret
    stringData:
    .dockerconfigjson: |
        {
            "auths": {
            "registry.redhat.io": {
                "auth": "<encoded-string>"
            },
            "registry.connect.redhat.com": {
                "auth": "<encoded-string>"
            }
            }
        }
    type: kubernetes.io/dockerconfigjson
    ```
    The value you provide in the metadata.name field contains the secret name. Provide this value when asked for the <openshift-pull-secret>.

    Create a secret from the openshift-pull-secret.yaml file:
    ```shell
    oc apply -f openshift-pull-secret.yaml -n $PROJECT
    ```
Before to install the operator you can follow https://docs.mongodb.com/kubernetes-operator/v1.8/tutorial/install-k8s-operator/#install-k8s-operator instructions to install the mandatroy crds, or apply the follwing instructions : 

```shell
#update the namespace in the crds
cp ./manifest/operator/mongodb-enterprise-openshift.yaml ./$TMP_DIR/mongodb-enterprise-openshift.yaml
sed  -i "" s~PROJECTNAME~${PROJECT}~g ./$TMP_DIR/mongodb-enterprise-openshift.yaml
#apply
oc apply -f ./$TMP_DIR/mongodb-enterprise-openshift.yaml -n $PROJECT
```

#### Or install MongoDB Entreprise Operator from Operator HUB

select mongodb-entrerpise-operator from the OperatorHub, select the $PROJECT as a namespace and click on install
![select mongodb entreprise operator](./img/mongodb-entreprise-operator.png) 
![install mongodb entreprise operator](./img/install-mongodb-operator.png)


#### Install and configure Ops Manager
Create the admin credential of Ops Manager
```shell   
   oc apply -f ./manifest/mongo/opsman-admin-credential.yml -n $PROJECT 
``` 
Create the application DB credential of Ops Manager
```shell 
   oc apply -f ./manifest/mongo/opsman-db-credential.yml -n $PROJECT 
``` 
Deploy the OPS manager instance
```shell 
   oc apply -f ./manifest/mongo/opsman-instance.yml -n $PROJECT  
``` 

track the status of the Operations manager deployment
```shell 
oc get om -o yaml -w -n $PROJECT 
status:
  applicationDatabase:
    lastTransition: "2021-01-12T15:10:38Z"
    members: 3
    phase: Running
    type: ReplicaSet
    version: 4.2.2-ent
  backup:
    phase: ""
  opsManager:
    lastTransition: "2021-01-12T15:10:38Z"
    phase: Running
    replicas: 1
    url: http://ops-manager-svc.bbankapps-mongo.svc.cluster.local:8080
    version: 4.2.8
```

Expose svc 
```shell
oc expose svc ops-manager-svc
```
Get the route 
```shell
oc get route
NAME              HOST/PORT                                                                    PATH   SERVICES          PORT      TERMINATION   WILDCARD
ops-manager-svc   ops-manager-svc-bbankapps-mongo.apps.cluster-c32b.c32b.example.opentlc.com          ops-manager-svc   mongodb                 None
```
So make sure you are logged into the Operations Manager GUI ops-manager-svc-bbankapps-mongo.apps.cluster-c32b.c32b.example.opentlc.com  (opsman/r3dh4t2021!) .
Click on the very top right /Operations/ and /Organizations/. Click the green Button /NEW ORGANIZATION/. Give a name (we choose /red-orga/ here). On the next page you have the option to add additional users to your organization with certain roles. Click /Create Organization/ and the organization has come into being.

You now need the organization ID. Go to the page of your newly created organization (e.g. via /Operations/ in the top right corner, /Organizations/ and then the corresponding entry in the list of organizations). Click /Settings/ in the left menu column and note down the organization ID given on that page.
Next you must create an API key that allows the Operator to access the Operations Manager. Click /Access/ on the left and then select the tab /API keys/. Here click the big green button /Create API Key/. Note down the 8 character code below /Public Key/. Give a name to the API key and choose a permission - either /Organization Owner/ or /Organization Project Creator/. Click /Next/. Here is the only time when you see the private key completely in clear text. Write it down - you will need it shortly. 
Add a whitelist entry to allow the operator to access the Operations Manager API. Use the Operations Manager pod ID address. You can get it with : 
```shell
oc get pod  -l k8s-app=mongodb-enterprise-operator -o jsonpath='{.items[0].status.podIP}' 
10.128.2.32

Update the private and the public key on the file ./manifest/mongo/red-orga-api-key.yaml 
```
Create the API key secret
```shell
oc apply -f ./manifest/mongo/red-orga-api-key.yaml -n $PROJECT
```
Update the projectName (we choose "Red Project"), orgId and baseUrl properties in ./manifest/mongo/red-project-config.yaml. You can find the organization ID under CONTEXT/red-orga/ORGANIZATION/Settings).
To get the baseurl :
```shell
oc get om -o jsonpath='{.items[0].status.opsManager.url}'
http://ops-manager-svc.bbankapps-mongo.svc.cluster.local:8080
```

Deploy a MongoDB replica set cluster with 3 nodes ![replica set mongo documentation](https://docs.mongodb.com/kubernetes-operator/v1.8/tutorial/deploy-replica-set/)
```shell
oc apply -f ./manifest/mongo/red-replica-set.yml -n $PROJECT
```
That will create 3 replica set (statfulset) ressources, the project "Red Project"

track the status of rhe replica set deployment
```shell
oc get mdb red-replica-set -o yaml -w
------ truncked response
status:
  lastTransition: "2021-01-12T16:50:23Z"
  link: http://ops-manager-svc.bbankapps-mongo.svc.cluster.local:8080/v2/5ffdd293c5836b0070073f22
  members: 3
  phase: Running
  type: ReplicaSet
  version: 4.2.2-ent
-----
```
Update the "project" properties using the Project ID found under CONTEXT(select Red Project)/PROJECT/Settings in the files ./manifest/mongo/kogito-mongo-user.yml and ./manifest/mongo/admcomp-mongo-user.yml
Apply the custom ressources to create the user kogitouser and admcomp with their respectives roles

```shell
oc apply -f ./manifest/mongo/kogito-mongo-user.yml -n $PROJECT
oc apply -f ./manifest/mongo/admcomp-mongo-user.yml -n $PROJECT
```
expose POD

```shell
oc expose pod/red-replica-set-0 —type="NodePort"  —port 27017
oc expose pod/red-replica-set-1 —type="NodePort"  —port 27017
oc expose pod/red-replica-set-2 —type="NodePort"  —port 27017
```

####  Create  DB and collection

Get mongodb replica sets 
```shell
oc get pods    

NAME               READY   STATUS      RESTARTS   AGE
mongodb-1-deploy   0/1     Completed   0          40s
mongodb-1-g4mwf    1/1     Running     0          35s
```

Create the schema 
```shell
oc exec -it red-replica-set-2 -- /var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.2.2-ent/bin/mongo --host red-replica-set/red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017 --authenticationDatabase admin -u admcomp -p r3dh4t2021! < ./manifest/scripts/create-schema.js 

---- Result ----
MongoDB shell version v4.2.2
connecting to: mongodb://red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017/?authSource=admin&compressors=disabled&gssapiServiceName=mongodb&replicaSet=red-replica-set
2021-01-13T06:40:19.603+0000 I  NETWORK  [js] Starting new replica set monitor for red-replica-set/red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017
2021-01-13T06:40:19.603+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-1:27017
2021-01-13T06:40:19.603+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-0:27017
2021-01-13T06:40:19.603+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-2:27017
2021-01-13T06:40:19.622+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:40:19.625+0000 I  NETWORK  [ReplicaSetMonitor-TaskExecutor] Confirmed replica set for red-replica-set is red-replica-set/red-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017,red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017,red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:40:19.625+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:40:19.625+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
Implicit session: session { "id" : UUID("aed27591-73cd-4289-8683-9f0ad43d3a69") }
MongoDB server version: 4.2.2
switched to db companies
{
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1610520019, 1),
		"signature" : {
			"hash" : BinData(0,"UhLf3TpK2VncSGp0gzYyytNe9ck="),
			"keyId" : NumberLong("6916916951851728899")
		}
	},
	"operationTime" : Timestamp(1610520019, 1)
}
{
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1610520019, 2),
		"signature" : {
			"hash" : BinData(0,"UhLf3TpK2VncSGp0gzYyytNe9ck="),
			"keyId" : NumberLong("6916916951851728899")
		}
	},
	"operationTime" : Timestamp(1610520019, 2)
}
bye
----
```
add records
```shell
oc exec -it red-replica-set-2 -- /var/lib/mongodb-mms-automation/mongodb-linux-x86_64-4.2.2-ent/bin/mongo --host red-replica-set/red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017 companies -u admcomp -p r3dh4t2021! < ./manifest/scripts/insert-records.js

---- Result -----
MongoDB shell version v4.2.2
connecting to: mongodb://red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017/?authSource=admin&compressors=disabled&gssapiServiceName=mongodb&replicaSet=red-replica-set
2021-01-13T06:42:06.475+0000 I  NETWORK  [js] Starting new replica set monitor for red-replica-set/red-replica-set-0:27017,red-replica-set-1:27017,red-replica-set-2:27017
2021-01-13T06:42:06.475+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-1:27017
2021-01-13T06:42:06.475+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-2:27017
2021-01-13T06:42:06.475+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-0:27017
2021-01-13T06:42:06.488+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:42:06.500+0000 I  NETWORK  [ReplicaSetMonitor-TaskExecutor] Confirmed replica set for red-replica-set is red-replica-set/red-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017,red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017,red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:42:06.500+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
2021-01-13T06:42:06.500+0000 I  CONNPOOL [ReplicaSetMonitor-TaskExecutor] Connecting to red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local:27017
Implicit session: session { "id" : UUID("e53a1a4b-e8cd-4977-a1a7-666bf743d916") }
MongoDB server version: 4.2.2
WriteResult({ "nInserted" : 1 })
WriteResult({ "nInserted" : 1 })
WriteResult({ "nInserted" : 1 })
WriteResult({ "nInserted" : 1 })
bye
------  
```

#### Install knative-serving (serverless)

Install openshift-serverless operator from OperatorHub

https://docs.openshift.com/container-platform/4.6/serverless/installing_serverless/installing-openshift-serverless.html


Create a knative-serving instance
```shell
./manifest/scripts/knative-serving.sh
```

### Build the Loan Model

```shell
cd model
mvn clean install
```

#### Build and deploy serverless companies CRUD services

delete the services if exist
```shell
oc delete all,configmap,pvc,serviceaccount,rolebinding --selector app=companies-svc
```

##### build the container locally and push to the registry (java or native)
```shell
cd ../companies-svc
```
Update the following commands, ./manifest/services/companies-svc-knative.yml ./manifest/services/companies-svc-native-knative.yml files with 
- your own quay/docker repository
- the connection string should be : username:password@replica-set-x.replica-set-service.namespace.svc.cluster.local              

mongodb://admcomp:r3dh4t2021!@ed-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local,red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local,red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local"

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
cd ..
#change the namespace if your namespace is different to bbankapps-mongo
sed  -i "" s~bbankapps-mongo${PROJECT}~g ./manifest/services/companies-svc-knative.yml 
oc apply -f ./manifest/services/companies-svc-knative.yml -n $PROJECT
```
native
```shell
sed  -i "" s~bbankapps-mongo${PROJECT}~g ./manifest/services/companies-svc-native-knative.yml 
oc apply -f ./manifest/services/companies-svc-native-knative.yml -n $PROJECT
```

#### verify the service availability
Get route
```shell                                                                                                                                                                            
oc get routes.serving.knative.dev  | grep companies
companies-svc   companies-svc-bbank.apps.ocp4.ouachani.org          true
```

Browse the url  : http://companies-svc-bbankapps-mongo.apps.ocp4.ouachani.org/

![Verify service](./img/list-companies.png) 

### Build and deploy the services

#### Install Strimzi, infinispan and kogito operator

Install Infinispan/Red Hat Data Grid operator (operator version 1.1.X)
Install Strimizi operator
![strimzi installation](./img/install-strimzi.png) 
Install Kogito operator
![kogito installation](./img/install-kogito.png) 

#### Install data-index e.g the kogito-infra (kogito v0.17)
Deploy kafka infra
```shell
kogito install infra kogito-kafka-infra --kind Kafka --apiVersion kafka.strimzi.io/v1beta1 -p $PROJECT
```
Deploy data-index service

```shell
kogito install data-index --infra kogito-kafka-infra --image quay.io/kiegroup/kogito-data-index-mongodb:latest --config quarkus.mongodb.connection-string='mongodb://kogitouser:r3dh4t2021!@ red-replica-set-0.red-replica-set-svc.bbankapps-mongo.svc.cluster.local,red-replica-set-1.red-replica-set-svc.bbankapps-mongo.svc.cluster.local,red-replica-set-2.red-replica-set-svc.bbankapps-mongo.svc.cluster.local' --config quarkus.mongodb.database=kogito —config quarkus.mongodb.credentials.username=kogitouser --config quarkus.mongodb.credentials.password='r3dh4t2021!'  -p $PROJECT
```

This infra, will manage kafka topics and infinispan cache ! That’s one of the magic kogito I prefer, no need to worry about it. Kogito Operator will take care on topics/caches for us !

For each kogito service created, the Kogito operator will generate a configmap name nameofservice-protobuf-files that contains the protobuf of the models/processes to store all actions done by the process.

You can find the generated protobuf in /target/classes/persistence directory of each service.

Below an example of the gernerated protobuf

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


Let's deploy the kogito services


Deploy and configure eligibility service
```
#create the service throw kogito operator
kogito deploy-service eligibility --enable-persistence --enable-events
cd eligibility
# package the eligibility service 
mvn clean package -DskipTests=true
# deploy the binaries to Openshift
oc start-build eligibility --from-dir=target -n $PROJECT 
```
Configure eligibility properties
```
cd ..
DATA_INDEX_URL=$(oc get route data-index --output=jsonpath={..spec.host})
echo $DATA_INDEX_URL
COMPANIES_ROUTE_URL=$(oc get routes.serving.knative.dev --output=jsonpath={..status.url})
echo $COMPANIES_ROUTE_URL
ELIGIBILITY_URL=$(oc get route eligibility --output=jsonpath={..spec.host})
echo $ELIGIBILITY_URL
cat ./manifest/properties/eligibility.properties >> ./$TMP_DIR/application.properties
sed  -i "" s~COMPANIES_ROUTE_URL~${COMPANIES_ROUTE_URL}~g ./$TMP_DIR/application.properties 
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g ./$TMP_DIR/application.properties
sed  -i "" s~ELIGIBILITY_URL~${ELIGIBILITY_URL}~g ./$TMP_DIR/application.properties
oc get cm data-index-properties -o jsonpath='{.data.application\.properties}' >> ./$TMP_DIR/application.properties
oc create configmap data-index-properties --from-file=./$TMP_DIR/application.properties --dry-run -o yaml | oc apply -f 
```
Deploy and configure notation service
```
#create the service throw kogito operator
kogito deploy-service notation --enable-persistence --enable-events
cd notation
# package the notation service 
mvn clean package -DskipTests=true
# deploy the binaries to Openshift
oc start-build notation --from-dir=target -n $PROJECT 
```
Configure notation properties
```
cd ..
NOTATION_URL=$(oc get route notation --output=jsonpath={..spec.host})
echo $NOTATION_URL
cat ./manifest/properties/notation.properties >> ./$TMP_DIR/application.properties
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g ./$TMP_DIR/application.properties
sed  -i "" s~NOTATION_URL~${NOTATION_URL}~g ./$TMP_DIR/application.properties
oc get cm data-index-properties -o jsonpath='{.data.application\.properties}' >> ./$TMP_DIR/application.properties
oc create configmap notation-properties --from-file=./$TMP_DIR/application.properties --dry-run -o yaml | oc apply -f -
rm ./$TMP_DIR/application.properties
```
Deploy and configure loan service
```
#create the service throw kogito operator
kogito deploy-service loan --enable-persistence --enable-events
cd loan
# package the notation service 
mvn clean package -DskipTests=true
# deploy the binaries to Openshift
oc start-build loan --from-dir=target -n $PROJECT 
```
Configure loan properties
```shell
LOAN_URL=$(oc get route loan --output=jsonpath={..spec.host})
echo $LOAN_URL
cat ./manifest/properties/loan.properties >> ./$TMP_DIR/application.properties
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g ./$TMP_DIR/application.properties
sed  -i "" s~LOAN_URL~${LOAN_URL}~g ./$TMP_DIR/application.properties
oc get cm data-index-properties -o jsonpath='{.data.application\.properties}' >> ./$TMP_DIR/application.properties
oc create configmap loan-properties --from-file=./$TMP_DIR/application.properties --dry-run -o yaml | oc apply -f -
rm ./$TMP_DIR/application.properties
```



From the kogito operator, create the management-console
![management console](./img/create-mgmt-console.png) 

Or using cli
```shell
kogito install mgmt-console -p $PROJECT
```

First get the route of the management console
```shell
oc get route management-console  
NAME                 HOST/PORT                                              PATH   SERVICES             PORT   TERMINATION   WILDCARD
management-console   management-console-bbankapps-mongo.apps.ocp4.ouachani.org          management-console   8080                 None 
```

Install task-console
```shell
kogito install task-console -p $PROJECT
```
Get the task-console route
```shell
oc get route | grep task-console
task-console         task-console-bbankapps-mongo.apps.ocp4.ouachani.org     
```
you can access to the console using 2 users jdoe/jdoe or alice/alice
![task console](./img/task-console.png) 


## We are ready for tests, go find more people for help 😆


Let's execute 3 different cases :


### Loan Refused 

```shell
curl -X POST "http://loan-bbank.apps.ocp4.ouachani.org/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":0,\"hq\":2,\"dl\":16,\"ee\":4,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":false,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
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
oc new-app nodejs:12~http://github.com/mouachan/bbank-apps --context-dir=/bbank-ui  -l 'name=bbank-ui,app=bbank-ui,app.kubernetes.io/component=bbank-ui,app.kubernetes.io/instance=bbank-ui,deployment=bbank-ui' --source-secret=github -e  LOAN_VALIDATION_URL="http://loan-bbank.apps.ocp4.ouachani.org/loanValidation" -e   GRAPHQL_URL="http://data-index-bbank.apps.ocp4.ouachani.org/graphql"  --name=bbank-ui -n bbank
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


