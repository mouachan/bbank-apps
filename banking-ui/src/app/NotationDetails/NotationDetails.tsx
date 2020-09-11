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

interface INotationDetails {
  idProcess: string,
  notation: object
}
class NotationDetailsResult extends React.Component<{},INotationDetails>  {

  constructor(props) {
    super(props);
    this.state = {
      idProcess:  "6500ca48-cc02-4910-b289-44cb9ff60237",
      notation: {}
    }
  }
getNotation = () => {
  var graphql = "http://localhost:8180/graphql";
  console.log(graphql);
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


