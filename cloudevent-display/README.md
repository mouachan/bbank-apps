# Vertx + CloudEvents display

## Build

```shell
mvn package
```

## Run

```shell
mvn vertx:run 
```

## test
```shell
curl -X POST \                                                                  09:14:34
-H "content-type: application/json"  \
-H "ce-specversion: 1.0"  \
-H "ce-source: /from/localhost"  \
-H "ce-type: eligibilityapplication" \
-H "ce-id: 12346"  \
-d "{\"age\":3,\"amount\":50000,\"bilan\":{\"gg\":5,\"ga\":2,\"hp\":1,\"hq\":2,\"dl\":50,\"ee\":2,\"siren\":\"423646512\",\"variables\":[]},\"ca\":200000,\"eligible\":false,\"msg\":\"string\",\"nbEmployees\":10,\"notation\":{\"decoupageSectoriel\":0,\"note\":\"string\",\"orientation\":\"string\",\"score\":0,\"typeAiguillage\":\"string\"},\"publicSupport\":true,\"siren\":\"423646512\",\"typeProjet\":\"IRD\"}" \
http://localhost:8080
{"age":3,"amount":50000,"bilan":{"gg":5,"ga":2,"hp":1,"hq":2,"dl":50,"ee":2,"siren":"423646512","variables":[]},"ca":200000,"eligible":false,"msg":"string","nbEmployees":10,"notation":{"decoupageSectoriel":0,"note":"string","orientation":"string","score":0,"typeAiguillage":"string"},"publicSupport":true,"siren":"423646512","typeProjet":"IRD"}
```
## Build container
```shell
mvn compile jib:build -Dimage=registry.hub.docker.com/mouachani/cloudevent-display 
```

