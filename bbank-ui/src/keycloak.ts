import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'https://keycloak-idp.apps.ocp4.ouachani.org/auth',
  realm: 'bbank-apps',
  clientId: 'bbank-sso-client',
});

export default keycloak;