export DATA_INDEX_VERSION="0.17.0"
#DATA_INDEX_RUNNER=https://search.maven.org/remotecontent?filepath=org/kie/kogito/data-index-service/${DATA_INDEX_VERSION}/data-index-service-${DATA_INDEX_VERSION}-runner.jar
#wget -nc -O data-index-service-${DATA_INDEX_VERSION}-runner.jar ${DATA_INDEX_RUNNER}
java \
-Dquarkus.log.console.level=DEBUG -Dquarkus.log.category.\"org.kie.kogito\".min-level=DEBUG \
-Dquarkus.log.category.\"org.kie.kogito\".level=DEBUG \
-Dquarkus.infinispan-client.server-list=localhost:11222 \
-Dkogito.protobuf.folder=`pwd`/persistence \
-Dkogito.protobuf.watch=true \
-Dquarkus.http.port=8980 \
-jar data-index-service-infinispan-${DATA_INDEX_VERSION}-SNAPSHOT-runner.jar 
#-jar data-index-service-${DATA_INDEX_VERSION}-infinispan-runner.jar
