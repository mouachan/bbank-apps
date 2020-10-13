import React, { Component } from "react";

interface IProps {
  url: string;
}

class Dashboard extends React.Component<{},IProps> {
  
    constructor(props) {
      super(props);
      this.state = {
        url: ""
      }
    }
    componentDidMount(){
   var LOAN_VALIDATION_DASHBOARD_URL = process.env.LOAN_VALIDATION_DASHBOARD_URL || 'https://grafana-route-bbank-apps.apps.ocp4.ouachani.org/d/a97116ebad76d14b7171a5eb8be2bb3b/loan-dashboard-v2?from=1602504505281&to=1602526105281&orgId=1';
      this.setState({
        url: LOAN_VALIDATION_DASHBOARD_URL,
      })
    }
    render() {
      
  return (
    <iframe
    src={this.state.url} />
  );
    }
}
export { Dashboard };
