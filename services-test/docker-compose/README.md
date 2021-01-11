## Infrastructure services


To allow a quick setup of all services required to run this demo, we provide a docker compose template that starts the following services:
- Infinispan
- mongodb
- Kafka
- Prometheus
- Grafana
- Keycloak

This setup ensures that all services are connected using the default configuration as well as provisioning the BBank apps dashboard to Grafana.  

In order to use it, please ensure you have Docker Compose installed on your machine, otherwise follow the instructions available
 in [here](https://docs.docker.com/compose/install/).
 
### Starting required services

  You should start all the services before you execute any of the BBank apps applications, to do that please execute:
  
  For MacOS and Windows:
   to build all services including creation and init of mongodb "companies" database  

   docker-compose -f bbank-apps-macos-windows.yml up --build 

   to up all services (if the "companies" db is already built )

    docker-compose -f bbank-apps-macos-windows.yml up
  
  For Linux:
  
    docker-compose -f bbank-apps-linux.yml up
    
  Once all services bootstrap, the following ports will be assigned on your local machine:
  - Infinispan: 11222
  - mongo: 27017
  - Kafka: 9092
  - Prometheus: 9090
  - Grafana: 3000
  - keycloak : 8280
  
To access the Grafana dashboard, simply navigate to http://localhost:3000 and login using the default username 'admin' and password 'admin'.
Prometheus will also be available on http://localhost:9090, no authentication is required. 

### Stopping and removing volume data
  
  To stop all services, simply run:

    docker-compose -f bbank-macos-windows.yml stop
    
  It is also recommended to remove any of stopped containers by running:
  
    docker-compose -f bbank-macos-windows.yml rm  
    
  For more details please check the Docker Compose documentation.
  
    docker-compose --help  

  ### Start data-index
  ./data-index/run-data-index-minimal.sh
  ### Start management console
  ./mgmt-services/run-mgmt-console.sh
  ### Start kafdrop
  ./kafdrop/run-kafdrop.sh

  ### mongo credential
  login : admcomp
  password: r3dhat2020!

   ### test
   ```
   curl -X POST "http://localhost:8480/loanValidation" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"loan\":{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":50,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}}"
   ```
   


