#!/bin/bash
# Brendan Creane
# Block until a pod specified by a selector is "ready"
# or a timeout occurs.

#
# podStatus() - takes a selector as argument, e.g. "k8s-app=kube-dns"
# and returns the pod "ready" status as a bool string ("true"). Note that if
# the pod is in the "pending" state, there is no containerStatus yet, so
# podStatus() returns an empty string. Success means seeing the "true"
# substring, but failure can be "false" or an empty string.
#
function podStatus() {
  local label="$1"
  local status=$(kubectl get pods --selector="${label}" -o json --all-namespaces | jq -r '.items[] | .status.containerStatuses[]? | [.name, .image, .ready|tostring] |join(":")')
  echo "${status}"
}

#
# blockUntilPodIsReady() - takes a pod selector and a timeout in seconds
# as arguements. If the pod never stabilizes, bail. Otherwise return as
# soon as the pod is "ready."
#
function blockUntilPodIsReady() {
  local label="$1"
  local secs="$2"
  local friendlyPodName="$3"

  echo -n "Waiting for \"${friendlyPodName}\" to be ready: "
  until [[ $(podStatus "${label}") =~ "true" ]]; do
    if [ "$secs" -eq 0 ]; then
      echo "\"${friendlyPodName}\" never stabilized."
      exit 1
    fi

    : $((secs--))
    echo -n .
    sleep 1
  done
}

BBANK_APPS_DIR=$(pwd)
MANIFEST_DIR="${BBANK_APPS_DIR}/manifest"
TMP_DIR="${BBANK_APPS_DIR}/tmp"
STRIMZI_VERSION=0.17.0
INFINISPAN_VERSION=1.1.1.Final


if [[ -z ${PROJECT_NAME} ]]; then
  PROJECT_NAME=bbankapps
fi



DATA_INDEX_URL=$(oc get route data-index --output=jsonpath={..spec.host})

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

