import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import { HashRouter as Router } from 'react-router-dom'

import { DEV, PROD } from './js/constants/environments'
import { Provider } from "react-redux";
import theStore from "./js/store/index";
import Amplify from 'aws-amplify'
import config from './config'
import ThemeWrapper from './js/components/themeWrapper/ThemeWrapper'

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
      <ThemeWrapper theStore={theStore} />
    </Router>
  </Provider>,
  document.getElementById("root")
)
