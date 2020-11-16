export TASK_CONSOLE_VERSION="0.17.0"
TASK_CONSOLE_RUNNER=https://search.maven.org/remotecontent?filepath=org/kie/kogito/task-console/${TASK_CONSOLE_VERSION}/task-console-${TASK_CONSOLE_VERSION}-runner.jar
wget -nc -O task-console-${TASK_CONSOLE_VERSION}-runner.jar ${TASK_CONSOLE_RUNNER}