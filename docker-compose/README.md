## Infrastructure services


To allow a quick setup of all services required to run this demo, we provide a docker compose template that starts the following services:
- Infinispan
- Kafka
- Prometheus
- Grafana

This setup ensures that all services are connected using the default configuration as well as provisioning the Travel Agency dashboard to Grafana.  

In order to use it, please ensure you have Docker Compose installed on your machine, otherwise follow the instructions available
 in [here](https://docs.docker.com/compose/install/).
 
### Starting required services

  You should start all the services before you execute any of the Travel Agency applications, to do that please execute:
  
  For MacOS and Windows:
  
    docker-compose -f banking-apps-macos-windows.yml up
  
  For Linux:
  
    docker-compose -f banking-apps-linux.yml up
    
  Once all services bootstrap, the following ports will be assigned on your local machine:
  - Infinispan: 11222
  - Kafka: 9092
  - Prometheus: 9090
  - Grafana: 3000
  
To access the Grafana dashboard, simply navigate to http://localhost:3000 and login using the default username 'admin' and password 'admin'.
Prometheus will also be available on http://localhost:9090, no authentication is required. 

### Stopping and removing volume data
  
  To stop all services, simply run:

    docker-compose -f credit-services-macos-windows.yml stop
    
  It is also recommended to remove any of stopped containers by running:
  
    docker-compose -f credit-services-macos-windows.yml rm  
    
  For more details please check the Docker Compose documentation.
  
    docker-compose --help  

  ### Start data-index
  ./data-index/run-data-index-minimal.sh
  ### Start managment console
  ./mgmt-services/run-mgmt-console.sh
  ### Start kadrop
  ./kafdrop/run-kafdrop.sh

  ### Install mongodb
  brew install mongodb-community
  brew services start mongodb-community   
Connect to the db and :
mongo companies -u admcomp -p r3dhat2020!

```
#create users
> db.createUser(
...   {
...     user: "admin",
...     pwd: "",
...     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
...   }
... )
Successfully added user: {
    "user" : "admin",
    "roles" : [
        {
            "role" : "userAdminAnyDatabase",
            "db" : "admin"
        }
    ]
}
> db.createUser(
...   {
...     user: "mroot",
...     pwd: "",
...     roles: [ { role: "root", db: "admin" } ]
...   }
... )
Successfully added user: {
    "user" : "mroot",
    "roles" : [
        {
            "role" : "root",
            "db" : "admin"
        }
    ]
}

> db.createUser(
   {
     user: "admcomp",
     pwd:  "r3dhat2020!",
     roles: [ { role: "readWrite", db: "companies" } ]
   }
 )
Successfully added user: {
    "user" : "admcomp",
    "roles" : [
        {
            "role" : "readWrite",
            "db" : "companies"
        }
    ]
}
```
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

//create notation collection
db.createCollection( "notation", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "siren" ],
      properties: {
         siren: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         dateCalcul: {
            bsonType : "date",
            description: "must be a date"
         },
         score: {
            bsonType : "string",
            description: "must be a string"
         },
         note: {
            bsonType : "string",
            description: "must be a string"
         },
         orientation: {
            bsonType : "string",
            description: "must be a String"
         },
         typeAiguillage: {
            bsonType : "string",
            description: "must be a String"
         },
          decoupageSectoriel: {
            bsonType : "string",
            description: "must be a String"
         },
          detail: {
            bsonType : "string",
            description: "must be a string"
         }
      }
   } }
} )
//insertion notation
    var dateCalcul = new Date(2020, 07, 24);
  db.notation.insert({  siren: "542107651",
         "dateCalcul": dateCalcul,
         "note": "A",
         "orientation": "Favorable",
         "score": "0.1",
         "typeAiguillage": "MODELE_1",
         "decoupageSectoriel": "1",
         "detail": ""
              }
        )
//List of companies
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
### to run each service  : companies-svc, companies-notation-svc, companies-loan-application-svc :
 ./mvnw clean compile quarkus:dev 


