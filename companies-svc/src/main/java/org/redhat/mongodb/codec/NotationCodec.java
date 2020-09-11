
package org.redhat.mongodb.codec;

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

public class NotationCodec implements CollectibleCodec<Notation> {

    private final Codec<Document> documentCodec;

    public NotationCodec() {
        this.documentCodec = MongoClientSettings.getDefaultCodecRegistry().get(Document.class);
    }

    @Override
    public void encode(BsonWriter writer, Notation notation, EncoderContext encoderContext) {
        Document doc = new Document();
        doc.put("dateCalcul", notation.getDateCalcul());
        doc.put("siren", notation.getSiren());
        doc.put("note", notation.getNote());
        doc.put("orientation", notation.getOrientation());
        doc.put("score",notation.getScore());
        doc.put("decoupageSectorielle", notation.getDecoupageSectoriel());                
        doc.put("typeAiguillage", notation.getTypeAiguillage());
        doc.put("detail", notation.getDetail());
        documentCodec.encode(writer, doc, encoderContext);
    }

    @Override
    public Class<Notation> getEncoderClass() {
        return Notation.class;
    }

    @Override
    public Notation generateIdIfAbsentFromDocument(Notation document) {
        if (!documentHasId(document)) {
            document.setId(UUID.randomUUID().toString());
        }
        return document;
    }

    @Override
    public boolean documentHasId(Notation document) {
        return document.getId() != null;
    }

    @Override
    public BsonValue getDocumentId(Notation document) {
        return new BsonString(document.getId());
    }

    @Override
    public Notation decode(BsonReader reader, DecoderContext decoderContext) {
        Document document = documentCodec.decode(reader, decoderContext);
        Notation notation = new Notation();
        // if (document.getString("id") != null) {
        //     Notation.setId(document.getString("id"));
        // }
        notation.setDateCalcul(document.getDate("dateCalcul"));
        notation.setDecoupageSectoriel(document.getString("decoupageSectoriel"));
        notation.setDetail(document.getString("detail"));
        notation.setNote(document.getString("note"));
        notation.setOrientation(document.getString("orientation"));
        notation.setScore(document.getString("score"));
        notation.setSiren(document.getString("siren"));
        notation.setTypeAiguillage(document.getString("typeAiguillage"));
        return notation;
    }
}