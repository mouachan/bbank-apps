package org.redhat.mongodb.codec;

import org.redhat.mongodb.CompanyInfo;

import org.bson.codecs.Codec;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;

public class CompanyCodecProvider implements CodecProvider {
    @Override
    public <T> Codec<T> get(Class<T> clazz, CodecRegistry registry) {
        if (clazz == CompanyInfo.class) {
            return (Codec<T>) new CompanyCodec();
        } return null;
    }

}