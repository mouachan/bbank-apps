import * as React from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  TextContent,
  Title,
  PageSection,
  CardTitle,
  TextVariants,
  Form,
  FormGroup
} from '@patternfly/react-core';
import ReactJson from 'react-json-view';
import { useLastLocation } from 'react-router-last-location';
import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";

interface INotationDetails {
  idProcess: string,
  notation: object
}
function useQuery() {
  return new URLSearchParams(useLocation().search).get("idProcess");
}
class NotationDetailsResult extends React.Component<{},INotationDetails>  {

  constructor(props) {
    super(props);
    this.state = {
      idProcess:"1234"  ,
      notation: {}
    }
  }
getNotation = () => {
  var graphql = "http://localhost:8180/graphql";
  console.log(graphql);
  console.log(useQuery());
   fetch(graphql, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: "{ ProcessInstances (where: {id: {equal: \""+this.state.idProcess+"\"}}){variables} }"})
    })
    .then(r => r.json())
    .then(data => {
      var variables = data.data.ProcessInstances[0]["variables"];
      console.log(variables);
      var loan = JSON.parse(variables).loan;
      console.log(loan);
     // var notation = JSON.parse(loan).notation
      console.log(loan.notation);
      this.setState({
          notation: loan.notation
      })
    })
 };
render() {
  this.getNotation();
  return (
        <>
      <TextContent>
          <ReactJson src={this.state}/>
      </TextContent>
        </> 
  );
}
}
const NotationDetails: React.FunctionComponent = () => (
  <PageSection>
    <Card>
      <CardTitle>  
        <Title headingLevel="h1" size="lg">Notation</Title>
      </CardTitle>
      <CardBody> 
        <NotationDetailsResult/>
      </CardBody>
     
    </Card>
   
  </PageSection>
)
export {NotationDetails};


