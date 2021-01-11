BBANK_APPS_DIR=$(pwd)
MANIFEST_DIR="${BBANK_APPS_DIR}/manifest"
TMP_DIR="${BBANK_APPS_DIR}/tmp"
STRIMZI_VERSION=0.17.0
INFINISPAN_VERSION=1.1.1.Final

if [[ -z ${PROJECT_NAME} ]]; then
  PROJECT_NAME=test
fi
if [ -z "${VERSION}" ]; then
    VERSION=$(curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/kiegroup/kogito-cloud-operator/releases | python -c "import sys, json; print(json.load(sys.stdin)[0]['tag_name'])")
fi

echo "Installing Infinispan Operator"
oc apply -f "https://raw.githubusercontent.com/infinispan/infinispan-operator/${INFINISPAN_VERSION}/deploy/crd.yaml" -n ${PROJECT_NAME}
oc apply -f "https://raw.githubusercontent.com/infinispan/infinispan-operator/${INFINISPAN_VERSION}/deploy/rbac.yaml" -n ${PROJECT_NAME}
oc apply -f "https://raw.githubusercontent.com/infinispan/infinispan-operator/${INFINISPAN_VERSION}/deploy/operator.yaml" -n ${PROJECT_NAME}

echo "Installing Strimzi Operator"
wget "https://github.com/strimzi/strimzi-kafka-operator/releases/download/${STRIMZI_VERSION}/strimzi-${STRIMZI_VERSION}.tar.gz" -P "$TMP_DIR/"
tar zxf "${TMP_DIR}/strimzi-${STRIMZI_VERSION}.tar.gz" -C "$TMP_DIR"
find ${TMP_DIR}/strimzi-${STRIMZI_VERSION}/install/cluster-operator -name '*RoleBinding*.yaml' -type f -exec sed -i '' "s/namespace: .*/namespace: ${PROJECT_NAME}/" {} +
oc apply -f ${TMP_DIR}/strimzi-${STRIMZI_VERSION}/install/cluster-operator/ -n ${PROJECT_NAME}

echo "....... Installing Kogito Operator ${VERSION} ......."

declare url="https://github.com/kiegroup/kogito-cloud-operator/releases/download/${VERSION}/kogito-operator.yaml"

if [ -z "${PROJECT_NAME}" ]; then
  oc apply -f "${url}" -n "${PROJECT_NAME}"
else
  oc apply -f "${url}"
fi
