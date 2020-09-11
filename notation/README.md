

![Ouachani Logo](/img/logo.png) 

# Notation credit service 

## Goal

The service use Quarkus, Kogito and Knative, it aims to :
- create a credit notation service for a company, a dmn rule will calculate a note based on a company financial data  
- build and push 1 natives images version to an external registry (Quay) 

## Business Rules
DMN variables calculator Business Decision Service
![DMN variable calculator](/img/dmn_variables_service.png) 
DMN notation Decision service
![DMN notation Decision service](/img/dmn_notation_service.png) 

## Prerequesties 
Install :
- oc client
- knative client (kn)
- Openshift serverless operator from the operatorhub on your Openshift cluster

## Create a registry secret

```
oc create secret docker-registry quay-secret \
    --docker-server=quay.io/username \
    --docker-username=username \
    --docker-password=password\
    --docker-email=email

oc secrets link builder quay-secret
oc secrets link default quay-secret --for=pull
```

## Clone the source from github

```
git clone https://github.com/mouachan/banking-apps
```



## Build and generate native container image

```
cd notation
./mvnw clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=notation-native -Dquarkus.container-image.tag=native-1.0 -Pnative  -Dquarkus.native.container-build=true 

```

## Push the image to your registry (change the username by yours)

```
docker tag 'mouachani/notation:native-1.0 quay.io/mouachan/notation:native-1.0
docker push quay.io/mouachan/notation:native-1.0
```

## Apply the service 

Connect to your openshift cluster and apply the service 
```
echo "apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: notation
spec:
  template:
    metadata:
      name: notation-v1
    spec:
      containers:
        - image: >-
            quay.io/mouachan/notation:native-1.0
          env:
            - name: JAVA_OPTS
              value: "-Dvertx.cacheDirBase=/work/vertx"
      imagePullSecrets:
        - name: quay-secret" | oc apply -f -
```

## Test the services

### Not noted 
```
curl -X POST "http://notation.apps.ocp4.ouachani.net/Orientation" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"CodeNaf\":\"510662190\",\"Variables\": [{ \"valeur\":10,\"type\": \"rentab_13\"},{\"valeur\":25,\"type\": \"strfin_36\"}],\"rules\":[]}}"

{
  "Variables": [
    {
      "valeur": 10,
      "type": "rentab_13"
    },
    {
      "valeur": 25,
      "type": "strfin_36"
    }
  ],
  "ContrePartie": {
    "DecoupageSectoriel": 0,
    "TypeAiguillage": "NON_NOTE"
  },
  "ScoreFinal": [
    [
      0,
      {
        "valeur": 10,
        "type": "rentab_13"
      }
    ],
    [
      0,
      {
        "valeur": 25,
        "type": "strfin_36"
      }
    ]
  ],
  "Score": "function Score( Var, CP )",
  "rules": [],
  "Notation": {
    "Score": 0,
    "DecoupageSectoriel": 0,
    "Note": "A",
    "TypeAiguillage": "NON_NOTE",
    "Orientation": "Favorable",
    "Detail": [
      [
        0,
        {
          "valeur": 10,
          "type": "rentab_13"
        }
      ],
      [
        0,
        {
          "valeur": 25,
          "type": "strfin_36"
        }
      ]
    ]
  },
  "CodeNaf": "510662190"
}
```