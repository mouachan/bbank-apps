import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';

import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';

import keycloak from '../keycloak'

const App: React.FunctionComponent = () => (
  
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={(event, error) => {
      console.log('onKeycloakEvent', event, error);
    }}
    onTokens={(tokens) => {
      console.log('onKeycloakTokens', tokens);
    }}
  >
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  </ReactKeycloakProvider>
);

export { App };