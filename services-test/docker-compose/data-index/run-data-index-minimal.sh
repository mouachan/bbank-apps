export DATA_INDEX_VERSION="1.0.0.Final"
#DATA_INDEX_RUNNER="https://repository.jboss.org/nexus/service/local/artifact/maven/content?r=public&g=org.kie.kogito&a=data-index-service-infinispan&v=${DATA_INDEX_VERSION}&c=runner"
#wget -nc -O data-index-service-infinispan-${DATA_INDEX_VERSION}-runner.jar ${DATA_INDEX_RUNNER}
java \
-Dquarkus.log.console.level=DEBUG -Dquarkus.log.category.\"org.kie.kogito\".min-level=DEBUG \
-Dquarkus.log.category.\"org.kie.kogito\".level=DEBUG \
-Dquarkus.infinispan-client.server-list=127.0.0.1:11222 \
-Dinfinispan.remote.sasl-mechanism=PLAIN \
-Dquarkus.infinispan-client.sasl-mechanism=PLAIN \
-Dkogito.protobuf.folder=`pwd`/persistence \
-Dkogito.protobuf.watch=true \
-Dquarkus.http.port=8180 \
-Dquarkus.infinispan-client.auth-username=admin \
-Dquarkus.infinispan-client.auth-password=admin \
-Dinfinispan.client.hotrod.socket_timeout=500000 \
-Dinfinispan.client.hotrod.connect_timeout=500000 \
-Dinfinispan.client.hotrod.max_retries=5 \
-jar data-index-service-infinispan-${DATA_INDEX_VERSION}-runner.jar 
#-jar data-index-service-${DATA_INDEX_VERSION}-infinispan-runner.jar
