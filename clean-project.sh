kogito delete-service eligibility -p ${PROJECT_NAME}
kogito delete-service notation -p ${PROJECT_NAME}
kogito delete-service loan -p ${PROJECT_NAME}
oc delete KogitoSupportingService data-index -n ${PROJECT_NAME}
oc delete KogitoSupportingService task-console -n ${PROJECT_NAME}
oc delete KogitoSupportingService management-console -n ${PROJECT_NAME}
oc delete all,pods,dc,secret,configmap,pvc,service,serviceaccount,rolebinding --selector name=mongodb -n ${PROJECT_NAME}
oc delete service.serving.knative.dev companies-svc -n ${PROJECT_NAME}