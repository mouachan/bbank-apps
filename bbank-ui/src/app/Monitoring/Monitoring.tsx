import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';

import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions, DataListItem, DataListItemRow, DataListItemCells, DataListCell, FormGroup, DataList, DataListToggle, DataListCheck, DataListAction,DataListContent, Card, CardTitle, CardBody
} from '@patternfly/react-core';
import ReactJson from 'react-json-view';
import { JsonTable } from "react-json-table";
import Switch from 'react-bootstrap/esm/Switch';



export interface ISupportProps {
  processId: string,
  decision:  object,
  result: string,
  amount: number,
  rate: number,
  months: number,
  eligible: boolean,
  reason: string,
  mgmtconsole: string,
  dashboard: string,
  notation: object;
}


class Monitoring extends React.Component<{},ISupportProps> {
  
  constructor(props) {
    super(props);
    this.state = {
      processId: "",
      decision: {},
      result: "",
      amount: 0,
      rate: 0,
      months: 0,
      eligible: false,
      reason: "",
      mgmtconsole: "http://management-console-bbank-apps.apps.ocp4.ouachani.org/Process",
      dashboard: "https://grafana-route-bbank-apps.apps.ocp4.ouachani.org/d/a97116ebad76d14b7171a5eb8be2bb3b/loan-dashboard-v2?orgId=1&refresh=5s",
      notation: {},
    }
  }
  componentDidMount(){
    var GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://data-index-bbank-apps.apps.ocp4.ouachani.org/graphql'; 
    var idp = localStorage.getItem("idProcess") || "";
    console.log(GRAPHQL_URL);
    console.log("idProcess " + idp)
     fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: "{ ProcessInstances (where: {id: {equal: \""+idp+"\"}}){variables} }"})
      })
      .then(r => r.json())
      .then(data => {
        var variables = data.data.ProcessInstances[0]["variables"];
        console.log(variables);
        var loan = JSON.parse(variables).loan;
        console.log(loan);
       // var notation = JSON.parse(loan).notation
        console.log(loan.notation);
        var res;
        var dec;
        if(loan.eligible){
          res = "Approved"
          dec = {Process : {id: idp, result: res}, Offer: {amount: loan.amount+"€", rate: loan.rate+"%", months: loan.nbmonths}, Reason: {notation: loan.notation}};
          

      } else {
          res = "Refused"
          dec = {Process : {id: idp, result: res}, Reason: {eligible: loan.eligible, details: loan.msg}};
        }
      this.setState({
        processId: idp,
        decision: dec,
        result: res,
        amount: loan.amount,
        rate: loan.rate,
        months: loan.nbmonths,
        eligible: loan.eligible,
        notation: loan.notation,
        reason: loan.msg,
        mgmtconsole: "http://management-console-bbank-apps.apps.ocp4.ouachani.org/Process/"+idp,
        dashboard: "https://grafana-route-bbank-apps.apps.ocp4.ouachani.org/d/a97116ebad76d14b7171a5eb8be2bb3b/loan-dashboard-v2?orgId=1&refresh=5s"
      })
      })
   }
   

   render() {
    if(this.state.eligible){
      return ( 
      <PageSection>
      <Card>
      <CardTitle>
        <Title headingLevel="h1" size="lg">Loan simulation result</Title>
      </CardTitle>
      <CardBody>
      <DataList aria-label="Decision" >
      <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
          <div style={titleStyle}> Process ID </div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
            <div style={textStyle}>{this.state.processId}</div>
            </p>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
          <div style={titleStyle}> Result </div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
            <div style={textStyle}>{this.state.result} </div>
            </p>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="offer">
          <DataListCell>
          <div style={titleStyle}>Offer </div>
          </DataListCell>
          <DataListContent aria-label="details-offer">
            <p>
            <div style={textStyle}> Amount : {this.state.amount}€ </div>
            </p>
          </DataListContent>
          <DataListContent aria-label="Term">
            <p>
            <div style={textStyle}>  Term : {this.state.months} months</div>
            </p>
          </DataListContent>
          <DataListContent aria-label="Rate">    
          <div style={textStyle}> Rate : {this.state.rate}% </div>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="notation">
          <DataListCell>
          <div style={titleStyle}>Notation details </div>
          </DataListCell>
          <DataListContent aria-label="notation">
            <ReactJson src={this.state.notation} theme="rjv-default"   name="notation" collapsed={false} displayObjectSize={false} displayDataTypes={false} />
          </DataListContent>
        </DataListItem>
        <DataListItem aria-labelledby="console">
          <DataListCell>
          <div style={titleStyle}>Process monitoring</div>
          </DataListCell>
          <DataListContent aria-label="console-details">
              <div style={textStyle}> Click on the process id </div> <a style={linkStyle}  href={this.state.mgmtconsole} target="_blank" rel="noopener noreferrer"> {this.state.processId} </a>
          </DataListContent>
        </DataListItem>
        <DataListItem aria-labelledby="console">
          <DataListCell>
          <div style={titleStyle}>Dashboard</div>
          </DataListCell>
          <DataListContent aria-label="dashboard-details">
          <a style={linkStyle} href={this.state.dashboard} target="_blank" rel="noopener noreferrer"> Loan KPI</a>
          </DataListContent>
        </DataListItem>
      </DataList>
      </CardBody>
      </Card>
      </PageSection>
      )
    }else {
      return(

        <PageSection>
      <Card>
      <CardTitle>
        <Title headingLevel="h1" size="lg">Loan simulation result</Title>
      </CardTitle>
      <CardBody>
      <DataList aria-label="Decision" >
      <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
          <div style={titleStyle}> Process ID </div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
            <div style={textStyle}>  {this.state.processId}</div>
            </p>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
          <div style={titleStyle}> Result </div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
            <div style={textStyle}>{this.state.result}</div>
            </p>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="reason">
          <DataListCell>
          <div style={titleStyle}>Reason </div>
          </DataListCell>
          <DataListContent aria-label="details-reason">
            <p>
            <div style={textStyle}>{this.state.reason}</div>
            </p>
          </DataListContent>
         </DataListItem>
      </DataList>
      </CardBody>
      </Card>
      </PageSection>)
    }
    }
  }

  const titleStyle = {
    color: 'black',
    fontSize: 14,  
    fontWeight: 'bold'
  };

  const textStyle = {
    color: 'black',
    fontSize: 14,  
    fontWeight: 'italic'
  };
  const linkStyle = {
    color: 'blue',
    fontSize: 14,  
    fontWeight: 'italic'
  };
  
export { Monitoring };
