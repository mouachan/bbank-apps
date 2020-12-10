package org.redhat.mongodb;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;

@Path("/notation")
@Consumes("application/json")
@Produces("application/json")
public class NotationResource {

   // @Inject CompanyService companyService;

    @GET
    public List<Notation> list() {
        List<Notation> notations = Notation.listAll();
        return notations;
    }

    @POST
    @Path("/add")
    public List<Notation> add(Notation notation) {
        notation.persist();
        return list();
    }



    @GET
    @Path("/search/{siren}")
    public List<Notation> findBySiren(@PathParam("siren") String siren){
        return Notation.findBySiren(siren);
    }

    @GET
    @Path("/search/first/{siren}")
    public Notation findFirstBySiren(@PathParam("siren") String siren){
        return Notation.findFirstBySiren(siren);
    }

 
}