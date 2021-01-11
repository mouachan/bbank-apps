#!/bin/bash
source utils.sh



BBANK_APPS_DIR=$(pwd)
MANIFEST_DIR="${BBANK_APPS_DIR}/manifest"
TMP_DIR="${BBANK_APPS_DIR}/tmp"
STRIMZI_VERSION=0.17.0
INFINISPAN_VERSION=1.1.1.Final
PROJECT_NAME=bbankapps

if [[ -z ${PROJECT_NAME} ]]; then
  PROJECT_NAME=bbankapps
fi

echo "bbank-apps dir : ${BBANK_APPS_DIR}"
#echo "creating tmp directory"
#mkdir $TMP_DIR
#echo "Deploying loan validation Demo on ${PROJECT_NAME} namespace"
#oc create namespace "$PROJECT_NAME"


sh ./manifest/scripts/knative-serving.sh

echo "Deploying Infinispan infra"
kogito install infra kogito-infinispan-infra --kind Infinispan --apiVersion infinispan.org/v1 -p ${PROJECT_NAME}

echo "Deploying kafka infra"
kogito install infra kogito-kafka-infra --kind Kafka --apiVersion kafka.strimzi.io/v1beta1 -p ${PROJECT_NAME}

echo "Deploying Data Index"
kogito install data-index --infra kogito-infinispan-infra --infra kogito-kafka-infra -p ${PROJECT_NAME}

echo "Deploying Management Console"
kogito install mgmt-console -p ${PROJECT_NAME}

echo "Deploying task console"
kogito install task-console -p ${PROJECT_NAME}

#check if mongdb-persistent template exist
#oc create -f https://raw.githubusercontent.com/openshift/origin/master/examples/db-templates//mongodb-persistent-template.json

echo "Deploying mongodb-persistent"
oc process mongodb-persistent -n openshift -p MONGODB_USER=admcomp -p MONGODB_PASSWORD=r3dhat2020! -p MONGODB_DATABASE=companies -p MONGODB_ADMIN_PASSWORD=r3dhat2020! \
| oc create -f -

blockUntilPodIsReady  "name=mongodb" 120 "mongo"  # Block until mongo is running & ready

echo "Get mongo pod"
MONGO_POD_NAME=$(oc get pods --output=jsonpath={.items..metadata.name} -l 'name=mongodb')


 
echo "Create the company schema"
oc exec -it $MONGO_POD_NAME -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ${MANIFEST_DIR}/scripts/create-schema.js  

echo "add records"
oc exec -it $MONGO_POD_NAME -- bash -c  'mongo companies -u admcomp -p r3dhat2020!' < ${MANIFEST_DIR}/scripts/insert-records.js  
# create build and deploy kogito services 

## model
cd ${BBANK_APPS_DIR}/model
mvn clean install
wait
## companies services
cd ${BBANK_APPS_DIR}/companies-svc
mvn clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=1.0
wait
docker tag mouachani/companies-svc:1.0 quay.io/mouachan/companies-svc:1.0
wait
docker push quay.io/mouachan/companies-svc:1.0
wait
oc apply -f ../manifest/services/companies-svc-knative.yml 
while [[ $(oc get service.serving.knative.dev companies-svc -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; 
do 
echo "waiting for companies-svc knative service" && sleep 1; 
done

#blockUntilPodIsReady  "name=mongodb" 120 "mongo"  # Block until mongo is running & ready

COMPANIES_ROUTE_URL=$(oc get routes.serving.knative.dev --output=jsonpath={..status.url})
DENOMINATION=$(curl $COMPANIES_ROUTE_URL/companies/search/542107651 | jq '.denomination' | xargs)
echo $DENOMINATION
if [ $DENOMINATION != "ENGIE" ];
then 
echo "exiting" 
exit -1
fi

DATA_INDEX_URL=$(oc get route data-index --output=jsonpath={..spec.host})
echo $DATA_INDEX_URL

echo "Deploying eligibility service" 
oc apply -f ${MANIFEST_DIR}/services/eligibility-kogitoapp.yml
cd ${BBANK_APPS_DIR}/eligibility
mvn clean package -DskipTests=true
wait
oc start-build eligibility --from-dir=target

blockUntilPodIsReady  "app=eligibility" 120 "eligibility"  # Block until eligibility is running & ready

rm $TMP_DIR/application.properties
echo $DATA_INDEX_URL
COMPANIES_ROUTE_URL=$(oc get routes.serving.knative.dev --output=jsonpath={..status.url})
echo $COMPANIES_ROUTE_URL
ELIGIBILITY_URL=$(oc get route eligibility --output=jsonpath={..spec.host})
echo $ELIGIBILITY_URL
cat ${MANIFEST_DIR}/properties/eligibility.properties >> $TMP_DIR/application.properties
sed  -i "" s~COMPANIES_ROUTE_URL~${COMPANIES_ROUTE_URL}~g $TMP_DIR/application.properties 
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g $TMP_DIR/application.properties
sed  -i "" s~ELIGIBILITY_URL~${ELIGIBILITY_URL}~g $TMP_DIR/application.properties
oc get cm eligibility-properties -o jsonpath='{.data.application\.properties}' >> $TMP_DIR/application.properties

oc delete configmap eligibility-properties 
oc create configmap eligibility-properties --from-file=$TMP_DIR/application.properties


echo "Deploying notation service" 
rm $TMP_DIR/application.properties
oc apply -f ${MANIFEST_DIR}/services/notation-kogitoapp.yml
cd ${BBANK_APPS_DIR}/notation
mvn clean package -DskipTests=true
wait
oc start-build notation --from-dir=target
blockUntilPodIsReady  "app=notation" 120 "notation"  # Block until notation is running & ready
NOTATION_URL=$(oc get route notation --output=jsonpath={..spec.host})
echo $NOTATION_URL
cat ${MANIFEST_DIR}/properties/notation.properties >> $TMP_DIR/application.properties
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g $TMP_DIR/application.properties
sed  -i "" s~NOTATION_URL~${NOTATION_URL}~g $TMP_DIR/application.properties
oc get cm notation-properties -o jsonpath='{.data.application\.properties}' >> $TMP_DIR/application.properties
oc delete configmap notation-properties 
oc create configmap notation-properties --from-file=$TMP_DIR/application.properties


echo "Deploying loan service" 
rm $TMP_DIR/application.properties
wait
oc apply -f ${MANIFEST_DIR}/services/loan-kogitoapp.yml
cd ${BBANK_APPS_DIR}/loan
mvn clean package -DskipTests=true
wait
oc start-build loan --from-dir=target

blockUntilPodIsReady  "app=loan" 240 "loan"  # Block until loan is running & ready

LOAN_URL=$(oc get route loan --output=jsonpath={..spec.host})
echo $LOAN_URL
cat ${MANIFEST_DIR}/properties/loan.properties >> $TMP_DIR/application.properties
wait
sed  -i "" s~DATA_INDEX_URL~${DATA_INDEX_URL}~g $TMP_DIR/application.properties
wait
sed  -i "" s~LOAN_URL~${LOAN_URL}~g $TMP_DIR/application.properties
wait
oc get cm loan-properties -o jsonpath='{.data.application\.properties}' >> $TMP_DIR/application.properties

oc delete configmap loan-properties 
oc create configmap loan-properties --from-file=$TMP_DIR/application.properties
