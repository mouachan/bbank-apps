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
import org.kie.kogito.monitoring.prometheus.common.process.PrometheusProcessEventListener;
import org.redhat.bbank.model.Bilan;
import org.redhat.bbank.model.Variable;
import org.redhat.bbank.model.Notation;
import org.kie.api.event.process.ProcessCompletedEvent;

import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.Counter;

public class NotationPrometheusProcessEventListener extends PrometheusProcessEventListener {
	
	protected final Counter numberOfNotationApplicationsApproved = Counter.build()
            .name("notation_approved_total")
            .help("Approved loan applications")
            .labelNames("app_id","model_type", "score","note","strfin_var","rentab_var" )
            .register();
	
	protected final Counter numberOfNotationApplicationsRejected = Counter.build()
            .name("notation_rejected_total")
            .help("Rejected notation applications")
            .labelNames("app_id", "reason", "decoupage_sectoriel" )
			.register();

	private String identifier;
	
	public NotationPrometheusProcessEventListener(String identifier) {
		super(identifier);
		this.identifier = identifier;
	}
	
	public void cleanup() {
		CollectorRegistry.defaultRegistry.unregister(numberOfNotationApplicationsApproved);
		CollectorRegistry.defaultRegistry.unregister(numberOfNotationApplicationsRejected);
	}

	@Override
	public void afterProcessCompleted(ProcessCompletedEvent event) {
		super.afterProcessCompleted(event);
		final WorkflowProcessInstanceImpl processInstance = (WorkflowProcessInstanceImpl) event.getProcessInstance();
		if (processInstance.getProcessId().equals("computeNotation")) {
			Notation notation = (Notation) processInstance.getVariable("_notation");
			Bilan bilan = (Bilan) processInstance.getVariable("bilan");
		
			if (!notation.getTypeAiguillage().equals("NON_NOTE")) {
				Variable strfin = bilan.getVariables().get(0);
				Variable rentab = bilan.getVariables().get(1);

				numberOfNotationApplicationsApproved.labels(identifier, safeValue(notation.getTypeAiguillage()), String.valueOf(notation.getScore()), safeValue(String.valueOf(notation.getNote())), safeValue(String.valueOf(strfin.getValue())),safeValue(String.valueOf(rentab.getValue()))).inc();
			} else {
				numberOfNotationApplicationsRejected.labels(identifier, safeValue(notation.getTypeAiguillage()),safeValue(String.valueOf(notation.getDecoupageSectoriel()))).inc();
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
