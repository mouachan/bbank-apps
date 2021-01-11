db.createUser(
   {
       user: "admcomp",
       pwd: "r3dhat2020!",
       roles: [
           {
               role: "readWrite",
               db: "companies"
           }
       ]
   }
);
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

var dateCalcul = new Date(2020, 07, 24);
db.notation.insert({  siren: "542107651",
       "dateCalcul": dateCalcul,
       "note": "A",
       "orientation": "Favorable",
       "score": "0.1",
       "typeAiguillage": "MODELE_1",
       "decoupageSectoriel": "1",
       "detail": ""
     })
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
