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
import org.kie.api.event.process.ProcessCompletedEvent;

import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;

public class LoanApplicationPrometheusProcessEventListener extends PrometheusProcessEventListener {
	
	protected final Counter numberOfLoanApplicationsApproved = Counter.build()
            .name("companies_loan_approved_total")
            .help("Approved loan applications")
            .labelNames("app_id", "duration")
            .register();
	
	protected final Counter numberOfLoanApplicationsRejected = Counter.build()
            .name("companies_loan_rejected_total")
            .help("Rejected loan applications")
            .labelNames("app_id", "duration")
            .register();

	private String identifier;
	
	public LoanApplicationPrometheusProcessEventListener(String identifier) {
		super(identifier);
		this.identifier = identifier;
	}
	
	public void cleanup() {
		CollectorRegistry.defaultRegistry.unregister(numberOfLoanApplicationsApproved);
		CollectorRegistry.defaultRegistry.unregister(numberOfLoanApplicationsRejected);
	}

	@Override
	public void afterProcessCompleted(ProcessCompletedEvent event) {
		super.afterProcessCompleted(event);
		final WorkflowProcessInstanceImpl processInstance = (WorkflowProcessInstanceImpl) event.getProcessInstance();
	}

	protected String safeValue(String value) {
		if (value == null) {
			return "unknown";
		}
		
		return value;
	}
}
