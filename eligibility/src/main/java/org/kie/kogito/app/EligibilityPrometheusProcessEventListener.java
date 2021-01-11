/**
 *  Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package org.kie.kogito.app;

import org.jbpm.workflow.instance.impl.WorkflowProcessInstanceImpl;
import org.kie.kogito.monitoring.process.PrometheusProcessEventListener;
import org.redhat.bbank.model.Loan;
import org.kie.api.event.process.ProcessCompletedEvent;

import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;

public class EligibilityPrometheusProcessEventListener extends PrometheusProcessEventListener {
	
	protected final Counter numberOfEligibleLoan= Counter.build()
            .name("eligible_loan_total")
            .help("Eligible loan applications")
            .labelNames("app_id" )
            .register();
	
	protected final Counter numberOfNonEligibleLoan = Counter.build()
            .name("eligible_rejected_total")
            .help("Non eligible loan applications")
            .labelNames("app_id", "reason")
			.register();

	private String identifier;
	
	public EligibilityPrometheusProcessEventListener(String identifier) {
		super(identifier);
		this.identifier = identifier;
	}
	
	public void cleanup() {
		CollectorRegistry.defaultRegistry.unregister(numberOfEligibleLoan);
		CollectorRegistry.defaultRegistry.unregister(numberOfNonEligibleLoan);
	}

	@Override
	public void afterProcessCompleted(ProcessCompletedEvent event) {
		super.afterProcessCompleted(event);
		final WorkflowProcessInstanceImpl processInstance = (WorkflowProcessInstanceImpl) event.getProcessInstance();
		if (processInstance.getProcessId().equals("eligibility")) {
			Loan application = (Loan) processInstance.getVariable("loan");
		
			if (application.isEligible()) {
				numberOfEligibleLoan.labels(identifier).inc();
			} else {
				numberOfNonEligibleLoan.labels(identifier, safeValue(application.getMsg())).inc();
			}
		
		}
	}

	protected String safeValue(String value) {
		if (value == null) {
			return "unknown";
		}		
		return value;
	}
}