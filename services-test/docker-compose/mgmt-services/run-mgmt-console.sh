export MGMT_CONSOLE_VERSION="1.0.0.Final"
MGMT_CONSOLE_RUNNER="https://repository.jboss.org/nexus/service/local/artifact/maven/content?r=public&g=org.kie.kogito&a=management-console&v=${MGMT_CONSOLE_VERSION}&c=runner"
wget -nc -O management-console-${MGMT_CONSOLE_VERSION}-runner.jar ${MGMT_CONSOLE_RUNNER}
java -Dquarkus.http.port=8780 -jar management-console-${MGMT_CONSOLE_VERSION}-runner.jar
