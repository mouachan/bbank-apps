package org.redhat.mongodb;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;

@Path("/companies")
@Consumes("application/json")
@Produces("application/json")
public class CompanyResource {

   // @Inject CompanyService companyService;

    @GET
    public List<CompanyInfo> list() {
        List<CompanyInfo> companies = CompanyInfo.listAll();
        return companies;
    }

    @POST
    public List<CompanyInfo> add(CompanyInfo companyInfo) {
       companyInfo.persist();
        return list();
    }

    @GET
    @Path("/search/{siren}")
    public CompanyInfo findBySiren(@PathParam("siren") String siren){
        return CompanyInfo.findBySiren(siren);
    }

    @GET
    @Path("/exist/{siren}")
    public String exist(@PathParam("siren") String siren){

        if(CompanyInfo.findFirstBySiren(siren) != null){
            System.out.println("company number :" +siren+" found");
            return "company number :" +siren+" found";
        }
        else {
            System.out.println("company number :" +siren+" not found");
            return "company number :" +siren+" not found";
        
        }
    }

 
}