export DATA_INDEX_VERSION="1.0.0-Final"
DATA_INDEX_RUNNER=https://search.maven.org/remotecontent?filepath=org/kie/kogito/data-index-service/${DATA_INDEX_VERSION}/data-index-service-${DATA_INDEX_VERSION}-runner.jar
wget -nc -O data-index-service-${DATA_INDEX_VERSION}-runner.jar ${DATA_INDEX_RUNNER}  

java \
-Dquarkus.log.console.level=DEBUG -Dquarkus.log.category.\"org.kie.kogito\".min-level=DEBUG \
-Dquarkus.log.category.\"org.kie.kogito\".level=DEBUG \
-Dquarkus.mongodb.connection-string='mongodb://kogitouser:r3dh4t2021!@mongodb:27017' \
-Dquarkus.mongodb.database=kogito \
—Dquarkus.mongodb.credentials.username=kogitouser \
-Dquarkus.mongodb.credentials.password='r3dh4t2021!' \
-Dkogito.protobuf.folder=`pwd`/persistence \
-Dkogito.protobuf.watch=true \
-Dquarkus.http.port=8180 \
-jar data-index-service-${DATA_INDEX_VERSION}-runner.jar   

