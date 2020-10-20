import Keycloak from 'keycloak-js';

const AUTH_URL= process.env.AUTH_URL || "https://keycloak-bbank.apps.ocp4.ouachani.org/auth";
const AUTH_REALM=process.env.AUTH_REALM ||  "kogito" ; 
const AUTH_CLIENTID=process.env.AUTH_CLIENTID ||  "bbank-ui";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: AUTH_URL,
  realm: AUTH_REALM,
  clientId: AUTH_CLIENTID,
});


export default keycloak;