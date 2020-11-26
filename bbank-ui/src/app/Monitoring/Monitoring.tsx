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
  reason: string,
  mgmtconsole: string,
  dashboard: string,
  taskconsole: string,
  notation: object,
  userTasks: { id: string, name: string, state: string, users: string};
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
      reason: "",
      mgmtconsole: process.env.MANAGEMENT_CONSOLE_URL,
      dashboard: process.env.GRAFANA_URL,
      taskconsole: process.env.TASK_CONSOLE_URL,
      notation: {},
      userTasks: {
       id: "", name: "", state: "", users: ""
      },
    }
  }
  componentDidMount(){
    var GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:8980/graphql';
    console.log(GRAPHQL_URL);
    var idp = localStorage.getItem("idProcess") || "";
    console.log("idProcess " + idp)
    var htQuery = JSON.stringify({query: "{ UserTaskInstances (where: { processInstanceId: {equal: \""+idp+"\"}}){id,name,processInstanceId,state,potentialUsers}}"}); 
    var loan;
    var taskid;   
      //get the result 
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
        loan = JSON.parse(variables).loan;
        console.log(loan);
       // var notation = JSON.parse(loan).notation
        console.log(loan.notation);
        if(loan.eligible){
          if(loan.notation.orientation == "To review"){
            fetch(GRAPHQL_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: htQuery
              })
              .then(r => r.json())
              .then(data => {
                console.log(data);
                if((data.data.UserTaskInstances[0] != null) && (data.data.UserTaskInstances[0].name != null)){
                   taskid = data.data.UserTaskInstances[0]["id"];
                   this.setState({
                    result: loan.notation.orientation, 
                    userTasks: { id: data.data.UserTaskInstances[0]["id"], name: data.data.UserTaskInstances[0]["name"], state: data.data.UserTaskInstances[0]["state"], users: data.data.UserTaskInstances[0]["potentialUsers"] },
                    taskconsole: this.state.taskconsole+"/TaskDetails/"+data.data.UserTaskInstances[0]["id"]
                  }) 
                }
                
              })
          } else {
              this.setState({
                result:  "Approved",
                decision:  {Process : {id: idp, result: "Approved"}, Offer: {amount: loan.amount+"€", rate: loan.rate+"%", months: loan.nbmonths}, Reason: {notation: loan.notation}},
                amount: loan.amount,
                rate: loan.rate,
                months: loan.nbmonths,
                notation: loan.notation
              })
         }
        } else {
            this.setState({
              result:  "Refused",
              decision: {Process : {id: idp, result: "Refused"}, Reason: {eligible: loan.eligible, details: loan.msg}},
              reason: loan.msg
            })
        }  
            this.setState({
              processId: idp,
              mgmtconsole: this.state.mgmtconsole+"/Process/"+idp
            })    
      })
      
   }
   
   render() {
    if(this.state.result == "To review"){
      return(
      <PageSection>
        <Card>
          <CardTitle>
            <Title headingLevel="h1" size="lg">Loan simulation result</Title>
          </CardTitle>
          <CardBody>
            <DataList aria-label="Human Tasks" >
              <DataListItem aria-labelledby="ex-item1">
                  <DataListCell>
                  <div style={titleStyle}> The case number {this.state.processId} need approval  </div>
                  </DataListCell>
                  <DataListContent aria-label="Human Task Details">
                      <div style={textStyle}>User Task name : {this.state.userTasks.name}</div>
                      <div style={textStyle}>User Task state : {this.state.userTasks.state}</div>
                      <div style={textStyle}>User Task users
                       <ReactJson src={this.state.userTasks.users} theme="rjv-default"   name="Potentiel Users" collapsed={false} displayObjectSize={false} displayDataTypes={false} />
                      </div>
                  </DataListContent>
                </DataListItem>
                <DataListItem aria-labelledby="task-console">
                  <DataListCell>
                    <div style={titleStyle}>Task monitoring</div>
                  </DataListCell>
                  <DataListContent aria-label="task-console-details">
                      <div style={textStyle}> Click on the task id </div> <a style={linkStyle}  href={this.state.taskconsole} target="_blank" rel="noopener noreferrer"> {this.state.userTasks.id} </a>
                  </DataListContent>
                </DataListItem>
            </DataList>
          </CardBody>
        </Card>
      </PageSection>)
    } else {
    if(this.state.result == "Approved" ){
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
                  <div style={textStyle}>{this.state.processId}</div>
                </DataListContent>
              </DataListItem>

              <DataListItem aria-labelledby="ex-item1">
                <DataListCell>
                  <div style={titleStyle}> Result </div>
                </DataListCell>
                <DataListContent aria-label="Primary Content Details">
                  <div style={textStyle}>{this.state.result} </div>
                </DataListContent>
              </DataListItem>

              <DataListItem aria-labelledby="offer">
                <DataListCell>
                  <div style={titleStyle}>Offer </div>
                </DataListCell>
                <DataListContent aria-label="details-offer">
                  <div style={textStyle}> Amount : {this.state.amount}€ </div>
                </DataListContent>
                <DataListContent aria-label="Term">
                  <div style={textStyle}>  Term : {this.state.months} months</div>
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
                  <ReactJson src={this.state.notation} theme="rjv-default" name="notation" collapsed={false} displayObjectSize={false} displayDataTypes={false} />
                </DataListContent>
              </DataListItem>
              <DataListItem aria-labelledby="console">
                <DataListCell>
                  <div style={titleStyle}>Process monitoring</div>
                </DataListCell>
                <DataListContent aria-label="console-details">
                  <div style={textStyle}> Click on the process id </div> <a style={linkStyle} href={this.state.mgmtconsole} target="_blank" rel="noopener noreferrer"> {this.state.processId} </a>
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
                    <div style={textStyle}>  {this.state.processId}</div>
                  </DataListContent>
              </DataListItem>

              <DataListItem aria-labelledby="ex-item1">
                <DataListCell>
                <div style={titleStyle}> Result </div>
                </DataListCell>
                <DataListContent aria-label="Primary Content Details">
                  <div style={textStyle}>{this.state.result}</div>  
                </DataListContent>
              </DataListItem>

              <DataListItem aria-labelledby="reason">
                <DataListCell>
                <div style={titleStyle}>Reason </div>
                </DataListCell>
                <DataListContent aria-label="details-reason">
                  <div style={textStyle}>{this.state.reason}</div>
                </DataListContent>
              </DataListItem>
            </DataList>
          </CardBody>
        </Card>
      </PageSection>)
    }
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
