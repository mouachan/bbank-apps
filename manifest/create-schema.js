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
