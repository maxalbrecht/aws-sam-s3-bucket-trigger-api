import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HashRouter as Router, Route } from 'react-router-dom'

import { Container } from 'react-bootstrap';
import { DEV, PROD } from './js/constants/environments'
import { Provider } from "react-redux";
import theStore from "./js/store/index";
import App from "./js/components/app/App"
import Login from './js/components/auth/login/Login'
import Register from './js/components/auth/register/Register'
import ChangePassword from './js/components/auth/changePassword/ChangePassword';
import About from "./pages/about"
import Documentation from "./pages/documentation"
import TitleBar from "./js/components/title_bar/TitleBar"
import FooterBar from "./js/components/footer_bar/FooterBar"

import Amplify from 'aws-amplify'
import config from './config'

const isDev = window.require('electron-is-dev');

let environment = ''

if(isDev) {
  environment = DEV
}
else {
  environment = PROD
}
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito[environment].REGION,
    userPoolId: config.cognito[environment].USER_POOL_ID,
    userPoolWebClientId: config.cognito[environment].APP_CLIENT_ID
  }
})

ReactDOM.render(
  <Provider store={theStore}>
    <Router>
      <Container xs={12} className="windowContainer">
        <TitleBar />
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/changepassword" component={ChangePassword} />
        <Route path="/register" component={Login} />
        <Route exact path="/app" component={App} />
        <Route path="/about" component={About} />                
        <Route path="/documentation" component={Documentation} />
        <FooterBar />
      </Container>
  </Router>
  </Provider>,
  document.getElementById("root")
    
)
