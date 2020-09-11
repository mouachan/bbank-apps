
package org.redhat.mongodb.codec;

import org.redhat.mongodb.CompanyInfo;
// import org.redhat.mongodb.notation.Notation;
import org.redhat.mongodb.Notation;

import com.mongodb.MongoClientSettings;
import org.bson.Document;
import org.bson.BsonWriter;
import org.bson.BsonValue;
import org.bson.BsonReader;
import org.bson.BsonString;
import org.bson.codecs.Codec;
import org.bson.codecs.CollectibleCodec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;

import java.util.UUID;

public class CompanyCodec implements CollectibleCodec<CompanyInfo> {

    private final Codec<Document> documentCodec;

    public CompanyCodec() {
        this.documentCodec = MongoClientSettings.getDefaultCodecRegistry().get(Document.class);
    }

    @Override
    public void encode(BsonWriter writer, CompanyInfo companyInfo, EncoderContext encoderContext) {
        Document doc = new Document();
        doc.put("statusRcs", companyInfo.getStatusRcs());
        doc.put("siren", companyInfo.getSiren());
        doc.put("siret", companyInfo.getSiret());
        doc.put("denomination", companyInfo.getDenomination());
        doc.put("address",companyInfo.getaddress());
        doc.put("type", companyInfo.getType());                
        doc.put("tva", companyInfo.getTva());
        doc.put("immatriculationDate", companyInfo.getImmatriculationDate());
        doc.put("updateDate", companyInfo.getUpdateDate());
        doc.put("capitalSocial", companyInfo.getCapitalSocial());
        doc.put("chiffreAffaire", companyInfo.getChiffreAffaire());
        doc.put("trancheEffectif", companyInfo.getCapitalSocial());
  
        documentCodec.encode(writer, doc, encoderContext);
    }

    @Override
    public Class<CompanyInfo> getEncoderClass() {
        return CompanyInfo.class;
    }

    @Override
    public CompanyInfo generateIdIfAbsentFromDocument(CompanyInfo document) {
        if (!documentHasId(document)) {
            document.setId(UUID.randomUUID().toString());
        }
        return document;
    }

    @Override
    public boolean documentHasId(CompanyInfo document) {
        return document.getId() != null;
    }

    @Override
    public BsonValue getDocumentId(CompanyInfo document) {
        return new BsonString(document.getId());
    }

    @Override
    public CompanyInfo decode(BsonReader reader, DecoderContext decoderContext) {
        Document document = documentCodec.decode(reader, decoderContext);
        CompanyInfo companyInfo = new CompanyInfo();
        // if (document.getString("id") != null) {
        //     companyInfo.setId(document.getString("id"));
        // }
        companyInfo.setStatusRcs(document.getString("statusRcs"));
        companyInfo.setSiren(document.getString("siren"));
        companyInfo.setSiret(document.getString("siret"));
        companyInfo.setDenomination(document.getString("denomination"));
        companyInfo.setaddress(document.getString("address"));
        companyInfo.setTva(document.getString("tva"));
        companyInfo.setType(document.getString("type"));
        companyInfo.setUpdateDate(document.getDate("updateDate"));
        companyInfo.setImmatriculationDate(document.getDate("immatriculationDate"));
        companyInfo.setCapitalSocial(document.getString("capitalSocial"));
        companyInfo.setChiffreAffaire(document.getString("chiffreAffaire"));
        companyInfo.setTrancheEffectif(document.getString("trancheEffectif"));
  
        // if(document.get("note") != null ){
        //     companyInfo.setNote((Notation)document.get("note"));
        // }
     
        return companyInfo;
    }
}