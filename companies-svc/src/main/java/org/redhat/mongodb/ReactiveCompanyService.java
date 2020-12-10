package org.redhat.mongodb;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.mongodb.client.result.InsertOneResult;

import org.bson.Document;
import org.redhat.mongodb.CompanyInfo;

import io.quarkus.mongodb.reactive.ReactiveMongoClient;
import io.quarkus.mongodb.reactive.ReactiveMongoCollection;
import io.smallrye.mutiny.Uni;

@ApplicationScoped
public class ReactiveCompanyService {

    @Inject
    ReactiveMongoClient mongoClient;

    public Uni<List<CompanyInfo>> list() {
        return getCollection().find().map(doc -> {
            CompanyInfo companyInfo = new CompanyInfo();
            companyInfo.setStatusRcs(doc.getString("statusRcs"));
            companyInfo.setSiren(doc.getString("siren"));
            companyInfo.setSiret(doc.getString("siret"));
            companyInfo.setDenomination(doc.getString("denomination"));
            companyInfo.setaddress(doc.getString("address"));
            companyInfo.setTva(doc.getString("tva"));
            companyInfo.setType(doc.getString("type"));
            companyInfo.setUpdateDate(doc.getDate("updateDate"));
            companyInfo.setImmatriculationDate(doc.getDate("immatriculationDate"));
            return companyInfo;
        }).collectItems().asList();
    }

    public Uni<InsertOneResult> add(CompanyInfo companyInfo) {
        Document document = new Document()
                .append("statusRcs", companyInfo.getStatusRcs())
                .append("siren", companyInfo.getSiren())
                .append("siret", companyInfo.getSiret())
                .append("denomination", companyInfo.getDenomination())
                .append("address",companyInfo.getaddress())
                .append("type", companyInfo.getType())                
                .append("tva", companyInfo.getTva())
                .append("immatriculationDate", companyInfo.getImmatriculationDate())
                .append("updateDate", companyInfo.getUpdateDate());
        return getCollection().insertOne(document);
    }

    private ReactiveMongoCollection<Document> getCollection() {
        return mongoClient.getDatabase("companies").getCollection("companyInfo");
    }
}