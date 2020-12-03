import Keycloak from 'keycloak-js';

const AUTH_URL= process.env.AUTH_URL; 
const AUTH_REALM=process.env.AUTH_REALM; 
const AUTH_CLIENTID=process.env.AUTH_CLIENTID;

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: AUTH_URL,
  realm: AUTH_REALM,
  clientId: AUTH_CLIENTID,
});


export default keycloak;