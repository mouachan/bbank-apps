package org.redhat.bbank.eligibility.rest;




import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;



@Path("/")
@RegisterRestClient
public interface CompaniesRemoteService {


    @GET
    @Path("/companies/exist/{siren}")
    @Produces("application/json")
    Boolean get(@PathParam("siren") String siren);

   

}