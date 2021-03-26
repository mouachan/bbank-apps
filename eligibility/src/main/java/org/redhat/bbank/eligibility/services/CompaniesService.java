package org.redhat.bbank.eligibility.services;


import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;


//import org.eclipse.microprofile.faulttolerance.Fallback;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.redhat.bbank.eligibility.rest.CompaniesRemoteService;
//import org.eclipse.microprofile.faulttolerance.Fallback;


@ApplicationScoped
public class CompaniesService {
    
    @Inject
    @RestClient
    CompaniesRemoteService companiesRemoteService;

    public Boolean get(String siren) {
        return companiesRemoteService.get(siren);
    }

    // @Fallback(fallbackMethod = "missingCompany")
    // public boolean missingCompany(String siren) {
    //     return false;
    // }

}