import React, { Component } from "react";

interface IProps {
  url: string;
}

class MgmtConsole extends React.Component<{},IProps> {
  
    constructor(props) {
      super(props);
      this.state = {
        url: ""
      }
    }
    componentDidMount(){
      var idp = localStorage.getItem("idProcess") || "";
      var MGMT_CONSOLE = process.env.LOAN_VALIDATION_MGMT_CONSOLE || 'http://management-console-bbank-apps.apps.ocp4.ouachani.org/Process/'
      this.setState({
        url: MGMT_CONSOLE+idp,
      })
    }
    render() {

  return (
    window.open(this.state.url, '_blank')
  );
    }
}
export { MgmtConsole };
