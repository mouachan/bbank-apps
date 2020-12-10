package org.kie.kogito.app;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.ext.Provider;
 
import org.kie.kogito.monitoring.system.interceptor.MetricsInterceptor;
 
@Provider
public class LoanInterceptors extends MetricsInterceptor {
    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        super.filter(requestContext, responseContext);
    }
}