import * as React from 'react';
import 'whatwg-fetch';
import { Form,
  Card, 
  CardTitle, 
  CardBody,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Switch,
  ActionGroup,
  Button,
  PageSection, 
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
  Title} from '@patternfly/react-core';
import ReactJson from 'react-json-view';




interface ILoanValidation {
  idProcess: string,
  siren: string,
  ca: number,
  nbEmployees: number,
  age: number,
  publicSupport: boolean,
  typeProjet: string,
  amount: number,
  loan: object,
  gg: number,
  ga: number,
  hp: number,
  hq: number,
  hn: number,
  fl: number,
  fm: number,
  dl: number,
  ee: number, 
  isResultModal: boolean, 
  alerts: Array<object>
  result: string;
};

class LoanValidationForm extends React.Component<{},ILoanValidation> {

  constructor(props) {
    super(props);
    this.state = {
      idProcess:"",
      siren: "423646512",
      ca: 50000,
      nbEmployees: 50,
      age: 3,
      publicSupport: true,
      typeProjet: 'AI',
      amount: 90000,
      loan: {},
      gg: 5,
      ga: 2,
      hp: 1,
      hq: 2,
      hn: 1,
      fl: 1,
      fm: 1,
      dl: 50,
      ee: 2,
      isResultModal: false,
      alerts: [],
      result: ""
    };
     
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  getId = () =>{return this.state.idProcess;}
  options = [
    { value: 'please choose', label: 'Please Choose', disabled: true },
    { value: 'AI', label: 'Aide Innovation', disabled: false },
    { value: 'ILAB', label: 'ILAB', disabled: false },
    { value: 'RDI', label: 'Recherche DEV et innovation', disabled: false }
  ];

  
 
  getUniqueId = () => (new Date().getTime());
  checkStateProcess = (graphql, id) => {
    fetch(graphql, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: "{ ProcessInstances (where: {id: {equal: \""+id+"\"}}){state} }"})
      })
      .then(r => r.json())
      .then(data => {
        console.log(data);
        if(data != null && data.data !== null  &&  data.data.ProcessInstances[0]["state"] == "COMPLETED"){
          this.getNotation(graphql,id);
        } else {
          this.checkStateProcess(graphql, id);
        }
      })
  };
  getNotation = (graphql, id) => {
    console.log(graphql);
     fetch(graphql, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: "{ ProcessInstances (where: {id: {equal: \""+id+"\"}}){variables} }"})
      })
      .then(r => r.json())
      .then(data => {
        var variables = data.data.ProcessInstances[0]["variables"];
        console.log(variables);
        var loan = JSON.parse(variables).loan;
        console.log(loan);
       // var notation = JSON.parse(loan).notation
        console.log(loan.notation);
        var result;
        if(loan.eligible){
          result = "Approved"
      } else {
          result = "Refused"
          loan.notation = null;
      }
      this.setState({
        loan: loan,
        result: result,
        isResultModal: true
    })
      })
   };

   handleSubmit(event) {

    var LOAN_VALIDATION_URL = process.env.LOAN_VALIDATION_URL || 'http://loan-bbank-apps.apps.ocp4.ouachani.org/loanValidation';
    var MANAGMENT_CONSOLE_URL = process.env.MANAGMENT_CONSOLE_URL;
    var GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://data-index-bbank-apps.apps.ocp4.ouachani.org/graphql'; 

     console.log("Loan Validation : "+LOAN_VALIDATION_URL);
     console.log("Graphql : "+GRAPHQL_URL);
   const payload =JSON.stringify({
      "loan":{
      "siren": this.state.siren,
      "ca": this.state.ca,
      "nbEmployees": this.state.nbEmployees,
      "age": this.state.age,
      "publicSupport": this.state.publicSupport,
      "typeProjet": this.state.typeProjet,
      "amount": this.state.amount,
      "bilan": { "siren": this.state.siren,"gg":this.state.gg,"ga":this.state.ga,"hp":this.state.hp,"hq":this.state.hq,"fl":this.state.fl,"fm":this.state.fm,"dl":this.state.dl,"ee":this.state.ee},
      "eligible": false,
      "msg": "",
      "notation": {
        "decoupageSectoriel": 0,
        "note": "string",
        "orientation": "",
        "score": 0,
        "typeAiguillage": ""
      }
    }
    });
    console.log(payload);
    fetch(LOAN_VALIDATION_URL , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: payload
    })
    .then(
      (result) => {
        if(result.ok){
          result.json().then((body) => { 
              console.log(body);
              this.setState({
                idProcess: body.id
              });
              this.checkStateProcess(GRAPHQL_URL, this.state.idProcess); 
              console.log(body.id);
            });
          } else {
            this.addAlert('Call Error : ' + result.status + ' ' + result.statusText , 'danger', this.getUniqueId());
          }
      },
      (error) => {
        this.addAlert('Network Error : ' + error, 'danger', this.getUniqueId());
      }
    );
    event.preventDefault();
  }

  convertLevel = (level, name) => {
    var ret = AlertVariant.default;
    if(level){
      if(level[name]){
        switch (level[name]) {
          case "LOW":
            ret = AlertVariant.success;
            break;
          case "MEDIUM":
            ret = AlertVariant.warning;
            break;   
          case "HIGH":
          case "VERY HIGH":
            ret = AlertVariant.danger;
            break; 
        }
      }
    }
    return ret;
  }

  
  

  addAlert = (title, variant, key) => {
    this.setState({
      alerts: [ ...this.state.alerts, { title: title, variant: variant, key }]
    });
  };

  removeAlert = key => {
    this.setState({ alerts: [...this.state.alerts.filter(el => el.key !== key)] });
  };

  handleResultModal = () => {
    this.setState(({ isResultModal }) => ({
      isResultModal: !isResultModal
    }));
  };

  handleSiren = (siren, event) => {
    this.setState({ siren });
//    this.handleSubmit("event");
  };

  handleCa = (ca, event) => {
    this.setState({ca : parseInt(ca.replace(/\D/g,''))});
//      this.handleSubmit("event");
};

  handleNbEmployee = (nbEmployees, event) => {
    this.setState({nbEmployees : parseInt(nbEmployees.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleAge= (age, event) => {
    this.setState({age : parseInt(age.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handlePublicSupport = (checked, event) => {
    this.setState({ ["publicSupport"] : event.target.checked });
//    this.handleSubmit("event");
  };

  handleTypeProjet= (typeProjet, event) => {
    this.setState({ typeProjet });
//      this.handleSubmit("event");
};

  handleAmount = (amount, event) => {
      this.setState({amount : parseInt(amount.replace(/\D/g,''))});
//      this.handleSubmit("event");
  };

  handleGg= (gg, event) => {
    this.setState({gg : parseInt(gg.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleGa= (ga, event) => {
    this.setState({ga : parseInt(ga.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleHp= (hp, event) => {
    this.setState({hp : parseInt(hp.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleHq= (hq, event) => {
    this.setState({hq : parseInt(hq.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleFl= (fl, event) => {
    this.setState({fl : parseInt(fl.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleFm= (fm, event) => {
    this.setState({fm : parseInt(fm.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleDl= (dl, event) => {
    this.setState({dl : parseInt(dl.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  handleEe= (ee, event) => {
    this.setState({ee : parseInt(ee.replace(/\D/g,''))});
//    this.handleSubmit("event");
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} isHorizontal >
        <AlertGroup isToast>
          {this.state.alerts.map(({key, variant, title}) => (
            <Alert
              isLiveRegion
              variant={AlertVariant[variant]}
              title={title}
              actionClose={
                <AlertActionCloseButton
                  title={title}
                  variantLabel={`${variant} alert`}
                  onClose={() => this.removeAlert(key)}
                />
              }
              key={key} />
          ))}
        </AlertGroup>
   
        <FormGroup
          label="Siren"
          isRequired
          fieldId="siren-param">
          <TextInput
            isRequired
            type="text"
            id="siren-param"
            name="siren-param"
            aria-describedby="siren-param-helper"
            value={this.state.siren}
            onChange={this.handleSiren}
          />
        </FormGroup>


        <FormGroup
          label="Project Type"
          isRequired
          fieldId="typeProjet-param">
          <FormSelect id="typeProjet-param" value={this.state.typeProjet} onChange={this.handleTypeProjet} aria-label="FormSelect Input">
            {this.options.map((option, index) => (
              <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
            ))}
          </FormSelect>
        </FormGroup>
        

        <FormGroup
          label="CA"
          isRequired
          fieldId="ca-param">
          <TextInput
            isRequired
            type="text"
            id="ca-param"
            name="ca"
            aria-describedby="ca"
            value={this.state.ca}
            onChange={this.handleCa}
          />
         </FormGroup>
        <FormGroup
          label="Amount"
          isRequired
          fieldId="amount-param">
          <TextInput
            isRequired
            type="text"
            id="amount-param"
            name="amount"
            aria-describedby="amount"
            value={this.state.amount}
            onChange={this.handleAmount}
          />
        </FormGroup>

        <FormGroup
          label="Employees number"
          isRequired
          fieldId="nbEmployees-param">
          <TextInput
            isRequired
            type="text"
            id="nbEmployees-param"
            name="nbEmployees"
            aria-describedby="nbEmployees"
            value={this.state.nbEmployees}
            onChange={this.handleNbEmployee}
          />
        </FormGroup>
        <FormGroup
          label="Public Support Project"
          fieldId="publicSupport-param">
          <Switch id="publicSupport-param" 
            label="Supported"
            labelOff="Not supported"
            isChecked={this.state.publicSupport}
            onChange={this.handlePublicSupport}/> 
        </FormGroup>

         
        <FormGroup
          label="gg"
          isRequired
          fieldId="gg-param">
          <TextInput
            isRequired
            type="text"
            id="gg-param"
            name="gg"
            aria-describedby="Variable de bilan gg"
            value={this.state.gg}
            onChange={this.handleGg}
          />
        </FormGroup>
        <FormGroup
          label="ga"
          isRequired
          fieldId="ga-param">
          <TextInput
            isRequired
            type="text"
            id="ga-param"
            name="ga"
            aria-describedby="Variable de bilan ga"
            value={this.state.ga}
            onChange={this.handleGa}
          />
        </FormGroup>
        <FormGroup
          label="hp"
          isRequired
          fieldId="hp-param">
          <TextInput
            isRequired
            type="text"
            id="hp-param"
            name="hp"
            aria-describedby="Variable de bilan hp"
            value={this.state.hp}
            onChange={this.handleHp}
          />
          </FormGroup>
          <FormGroup
          label="hq"
          isRequired
          fieldId="hq-param">
          <TextInput
            isRequired
            type="text"
            id="hq-param"
            name="hq"
            aria-describedby="Variable de bilan hq"
            value={this.state.hq}
            onChange={this.handleHq}
          />
          </FormGroup>
          <FormGroup
          label="fl"
          isRequired
          fieldId="fl-param">
          <TextInput
            isRequired
            type="text"
            id="fl-param"
            name="fl"
            aria-describedby="Variable de bilan fl"
            value={this.state.fl}
            onChange={this.handleFl}
          />
          </FormGroup>
          <FormGroup
          label="fm"
          isRequired
          fieldId="fm-param">
          <TextInput
            isRequired
            type="text"
            id="fm-param"
            name="fm"
            aria-describedby="Variable de bilan fm"
            value={this.state.fm}
            onChange={this.handleFm}
          />
          </FormGroup>
          <FormGroup
          label="dl"
          isRequired
          fieldId="dl-param">
          <TextInput
            isRequired
            type="text"
            id="fl-param"
            name="dl"
            aria-describedby="Variable de bilan dl"
            value={this.state.dl}
            onChange={this.handleDl}
          />
          </FormGroup>
          <FormGroup
          label="ee"
          isRequired
          fieldId="ee-param">
          <TextInput
            isRequired
            type="text"
            id="ee-param"
            name="ee"
            aria-describedby="Variable de bilan ee"
            value={this.state.ee}
            onChange={this.handleEe}
          />
          </FormGroup>
        <ActionGroup>
          <Button variant="primary" type="submit">Envoyer</Button>
        </ActionGroup>
        <Modal
          title="Result"
          variant={ModalVariant.small}
          isOpen={this.state.isResultModal}
          onClose={this.handleResultModal}
          
          actions={[
            <Button key="confirm" variant="primary" onClick={this.handleResultModal}>
              Close
            </Button>
          ]}>    
            <Alert variant={this.convertLevel("LOW","Process started")}  title={this.state.result}>
              <ReactJson src={this.state.loan} />
            </Alert> 
        </Modal>
      </Form>
    );
  }

}
const LoanValidation: React.FunctionComponent = () => (
  <PageSection>
    <Card>
      <CardTitle>  
        <Title headingLevel="h1" size="lg">Loan Validation Simulator</Title>
      </CardTitle>
      <CardBody> 
        <LoanValidationForm/>
      </CardBody>
     
    </Card>
  </PageSection>
)

export { LoanValidation };
