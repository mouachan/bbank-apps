package org.redhat.mongodb;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.redhat.mongodb.CompanyInfo;

import io.smallrye.mutiny.Uni;

@Path("/reactive_company")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReactiveCompanyResource {

    @Inject
    ReactiveCompanyService companyService;

    @GET
    public Uni<List<CompanyInfo>> list() {
        return companyService.list();
    }

    @POST
    public Uni<List<CompanyInfo>> add(CompanyInfo companyInfo) {
        return companyService.add(companyInfo)
                .onItem().ignore().andSwitchTo(this::list);
    }
}