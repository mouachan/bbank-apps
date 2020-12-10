package org.redhat.mongodb.codec;

import org.redhat.mongodb.Notation;
import org.bson.codecs.Codec;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;

public class NotationCodecProvider implements CodecProvider {
    @Override
    public <T> Codec<T> get(Class<T> clazz, CodecRegistry registry) {
        if (clazz == Notation.class) {
            return (Codec<T>) new NotationCodec();
        } return null;
    }

}