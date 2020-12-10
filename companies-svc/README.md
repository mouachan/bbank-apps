![Ouachani Logo](/img/logo.png) 

# Companies services management

## Goal

The application built on openshift use innovative technologies such Quarkus runtime, mongodb Panache framework (more details : https://quarkus.io/guides/mongodb-panache) to offer :
- a rich API services to register/update/remove company in/to/from the catalog

## Prerequesties 
Install :
- oc client
- odo client

## add a github secret to checkout sources 

```
oc create secret generic username \
    --from-literal=username=username \
    --from-literal=password=password \
    --type=kubernetes.io/basic-auth
```

## Clone the source from github
```
git clone https://github.com/mouachan/companies-svc.git

```
## Create a persistent mongodb 

From Openshift Developper view, click on Add,select Database

![Add database app](/img/catalog-db-ocp.png) 

From the developer catalog, click on MongoDB Template (persistent)

![Developer catalog](/img/developer-catalog.png) 

Click on Instantiate Template (use the filled values)

![Instantiate the template](/img/instantiate-template-mongodb.png) 

or use odo cli to instantiate the database

```
odo service create mongodb-persistent --plan default --wait -p DATABASE_SERVICE_NAME=mongodb -p MEMORY_LIMIT=512Mi -p MONGODB_DATABASE=companies -p VOLUME_CAPACITY=1Gi  -p app=companies-svc  -p MONGODB_ADMIN_PASSWORD=r3dhat2020! 
```

You can also use the mongodb operator

## Create  DB and collection

Connect to the db and :

```
#create db
use companies
#create collection
db.createCollection( "companyInfo", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "siren" ],
      properties: {
         siren: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         denomination: {
            bsonType : "string",
            description: "must be a string"
         },
         siret: {
            bsonType : "string",
            description: "must be a string"
         },
         address: {
            bsonType : "string",
            description: "must be a string"
         },
         capitalSocial: {
            bsonType : "string",
            description: "must be a String"
         },
         chiffreAffaire: {
            bsonType : "string",
            description: "must be a String"
         },
          trancheEffectif: {
            bsonType : "string",
            description: "must be a String"
         },
          tva: {
            bsonType : "string",
            description: "must be a string"
         },
         immatriculationDate: {
            bsonType : "date",
            description: "must be a Date"
         },
          type: {
            bsonType : "string",
            description: "must be a string"
         },
         updateDate: {
            bsonType : "date",
            description: "must be a Date"
         }
      }
   } }
} )
```
## Add companies
```
  var immatriculationDate = new Date(1954, 12, 24);
    var updateDate =  new Date(2020, 04, 11);
  db.companyInfo.insert({  siren: "542107651",
         "denomination": "ENGIE",
         "siret": "54210765113030",
         "address": "ENGIE, 1 PL SAMUEL DE CHAMPLAIN 92400 COURBEVOIE",
         "tva": "FR03542107651",
         "immatriculationDate": immatriculationDate,
         type: "SA à conseil d'administration",
         "updateDate": updateDate,
         "capitalSocial": "2 435 285 011,00 €",
         "chiffreAffaire": "27 833 000 000.00 €",
         "trancheEffectif": "5000 à 9999 salariés"
              }
        )

     var immatriculationDate = new Date(1920, 12, 01);
    var updateDate =  new Date(2020, 04, 01);
        db.companyInfo.insert({  siren: "423646512",
         "denomination": "FOURNIL SAINT JACQUES",
         "siret": "    42364651200016",
         "address": "11 RUE DE LA TOMBE ISSOIRE 75014 PARIS",
         "tva": "FR03423646512",
         "immatriculationDate": immatriculationDate,
         "type": "Société à responsabilité limitée",
         "updateDate": updateDate,
         "capitalSocial": "7 622,45 €",
         "chiffreAffaire": "NON Connu",
         "trancheEffectif": "1 à 2 salariés"
        })

     var immatriculationDate = new Date(2009, 02, 26);
    var updateDate =  new Date(2020, 04, 01);
      db.companyInfo.insert({  siren: "510662190",
         denomination: "ASHILEA",
         siret: "    51066219000014",
         address: "49 AV DE SAINT OUEN 75017 PARIS",
         tva: "FR0510662190",
         "immatriculationDate": immatriculationDate,
         "type": "Société par actions simplifiée",
         "updateDate": updateDate,
         "capitalSocial": "7 622,45 €",
         "chiffreAffaire": "21 000,00 €",
         "trancheEffectif": "10 salariés"
        }
   )
```
## Build the image on OpenShift

```
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:20.1.0-java11~https://github.com/mouachan/companies-svc.git --name=companies-svc

```

## Or build and generate container image

Java
```
./mvnw clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=1.0
```

Native 
```
./mvnw clean package  -Dquarkus.container-image.build=true -Dquarkus.container-image.name=companies-svc -Dquarkus.container-image.tag=native-1.0 -Pnative  -Dquarkus.native.container-build=true 
```

Push the image to your registry (change the username by yours)

Java
```
docker tag mouachani/companies-svc:1.0 quay.io/mouachan/companies-svc:1.0
docker push quay.io/mouachan/companies-svc:1.0
```
Native
```
docker tag mouachani/companies-svc:native-1.0 quay.io/mouachan/companies-svc:native-1.0
docker push quay.io/mouachan/companies-app/companies-svc:native-1.0
```

## Add company using the Swagger UI 

![Swagger API](/img/swagger-ui-companies-mgmt.png) 

## Add company using the UI

![Companies mgmt UI](/img/companies-mgmt.png) 

