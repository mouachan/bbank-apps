package org.redhat.bbank.listeners;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.ext.Provider;
 
import org.kie.kogito.monitoring.system.interceptor.MetricsInterceptor;
 
@Provider
public class NotationInterceptors extends MetricsInterceptor {
    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        super.filter(requestContext, responseContext);
    }
}