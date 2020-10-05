import React from "react";
import ReactDOM from "react-dom";
import { App } from '@app/index';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import * as Keycloak from 'keycloak-js';
if (process.env.NODE_ENV !== "production") {
  const config = {
    rules: [
      {
        id: 'color-contrast',
        enabled: false
      }
    ]
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000, config);
}



ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

// let keycloak = Keycloak({
//   url: 'http://localhost:8080/auth',
//   realm: 'bbank-apps',
//   clientId: 'bbank-ui',
// });

// var loadData = function () {
//   document.getElementById('subject').innerHTML = keycloak.subject;
//   if (keycloak.idToken) {
//       document.getElementById('profileType').innerHTML = 'IDToken';
//       document.getElementById('username').innerHTML = keycloak.idTokenParsed.preferred_username;
//       document.getElementById('email').innerHTML = keycloak.idTokenParsed.email;
//       document.getElementById('name').innerHTML = keycloak.idTokenParsed.name;
//       document.getElementById('givenName').innerHTML = keycloak.idTokenParsed.given_name;
//       document.getElementById('familyName').innerHTML = keycloak.idTokenParsed.family_name;
//   } else {
//       keycloak.loadUserProfile(function() {
//           document.getElementById('profileType').innerHTML = 'Account Service';
//           document.getElementById('username').innerHTML = keycloak.profile.username;
//           document.getElementById('email').innerHTML = keycloak.profile.email;
//           document.getElementById('name').innerHTML = keycloak.profile.firstName + ' ' + keycloak.profile.lastName;
//           document.getElementById('givenName').innerHTML = keycloak.profile.firstName;
//           document.getElementById('familyName').innerHTML = keycloak.profile.lastName;
//       }, function() {
//           document.getElementById('profileType').innerHTML = 'Failed to retrieve user details. Please enable claims or account role';
//       });
//   }}

// keycloak.init({ onLoad: 'login-required' })
//   .success(() => {
//     keycloak.loadUserProfile()
//     .then(function(profile) {
//         console.log("profile "+JSON.stringify(profile.firstName, null, "  "));
//         localStorage.setItem('profile', JSON.stringify(profile, null, "  "));

//     }).catch(function() {
//         alert('Failed to load user profile');
//     });
//     ReactDOM.render(
//       <App />,
//       document.getElementById('root') as HTMLElement
//     );    
//   })
//   .error(error => console.log(error));