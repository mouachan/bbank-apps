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
  EmptyStateSecondaryActions, DataListItem, DataListItemRow, DataListItemCells, DataListCell, FormGroup, DataList, DataListToggle, DataListCheck, DataListAction,DataListContent
} from '@patternfly/react-core';
import ReactJson from 'react-json-view';
import { JsonTable } from "react-json-table";
import Switch from 'react-bootstrap/esm/Switch';



export interface ISupportProps {
  processId: string,
  decision:  object,
  result: string;

}


class Monitoring extends React.Component<{},ISupportProps> {
  
  constructor(props) {
    super(props);
    this.state = {
      processId: "id",
      decision: {},
      result: ""

    }
  }
  componentDidMount(){
    var GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://data-index-bbank-apps.apps.ocp4.ouachani.org/graphql'; 
    var idp = localStorage.getItem("idProcess");
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
      })
      })
   }
   

   render() {
    return (
    <PageSection>
        <div>
        <ReactJson src={this.state.decision} theme="rjv-default"   name="Decision" collapsed={false} displayObjectSize={false} displayDataTypes={false}/>
      </div>
  
      <DataList aria-label="Decision">

      <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
            <div id="id">Process ID</div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
             {this.state.processId}
            </p>
          </DataListContent>
        </DataListItem>

        <DataListItem aria-labelledby="ex-item1">
          <DataListCell>
            <div id="result">Result</div>
          </DataListCell>
          <DataListContent aria-label="Primary Content Details">
            <p>
             {this.state.result}
            </p>
          </DataListContent>
        </DataListItem>
      
      </DataList>
    </PageSection>
  )
    }
  }

export { Monitoring };
