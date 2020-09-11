package org.redhat.bbank.listeners;

import javax.enterprise.context.ApplicationScoped;

import org.drools.core.config.DefaultRuleEventListenerConfig;
import org.kie.kogito.monitoring.rule.PrometheusMetricsDroolsListener;

@ApplicationScoped
public class NotationEventListenerConfig extends DefaultRuleEventListenerConfig {

    public NotationEventListenerConfig() {
        super( new PrometheusMetricsDroolsListener("notation-svc"));
    }
}