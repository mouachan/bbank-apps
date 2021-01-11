DIR=$(mktemp -d)
LEAK_RESOURCES=( infinispan keycloakclients keycloakusers keycloakrealms kogitoruntimes kogitosupportingservices)

oc get namespaces | grep "Terminating" | awk -F " " '{print $1}' > ${DIR}/projects

while read project
do 
	echo "Stuck project ${project}"

    for resource in "${LEAK_RESOURCES[@]}"
    do
      oc get $resource -n "${project}" | grep -v "NAME" | awk -F " " '{print $1}' > ${DIR}/$resource-instances
      while read instance
      do
          echo "Remove finalizer from $resource ${instance} from project ${project}"

          oc patch $resource ${instance} -n ${project} -p '{"metadata":{"finalizers":[]}}' --type=merge
      done < ${DIR}/$resource-instances
      rm ${DIR}/$resource-instances
    done
done < ${DIR}/projects

echo "Projects deleted:"
cat ${DIR}/projects

# Cleanup
rm ${DIR}/projects