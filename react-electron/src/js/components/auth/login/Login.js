import React, { Component } from 'react';
import Logging from './../../../utils/logging'
import { Form, Col } from 'react-bootstrap';
import fieldBind from './login.fields';
import { logicConstructor } from './login.logic/Login.logic'
import SectionTitle from './../../../utils/sectionTitle'
import defined from './../../../utils/defined'
import isDev from './../../../utils/is-dev'
import File from './../../../utils/file'
import AUTH_CONSTANTS from '../../../constants/auth';
import './../Auth.scss'

var DEV_CREDENTIALS
try {
  if(isDev) {
    DEV_CREDENTIALS = JSON.parse(File.getContent(AUTH_CONSTANTS.DEV_CREDENTIALS))
  }
}
catch(error) {
  Logging.logError("Error trying to initialize auth.login.logic.getConstructorState's dev credentials. Error:", error)
}

async function logInForDev(loginComponent) {
  console.log("this.state:")
  console.log(loginComponent.state)
  console.log("DEV_CREDENTIALS:")
  console.log(DEV_CREDENTIALS)


  if(isDev && loginComponent.state.username === DEV_CREDENTIALS.username && loginComponent.state.password === DEV_CREDENTIALS.password) {
    await loginComponent.handleSubmit()
    await loginComponent.handleConfirm()
  }
}

class Login extends Component {
  componentDidMount() {
    logInForDev(this)
  }

  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  MainFields() {
    if(!defined(this.state.cognitoUser)){
      return (
        <Form className="form" 
          onSubmit={this.handleSubmit}
        >
          <Form.Row>
            <Col>
              { SectionTitle('Log In') }
              { this.FormErrors() }
              <Form.Row>{ this.Username() }</Form.Row>
              <Form.Row>{ this.Password() }</Form.Row>
              { this.LoginButton() }
            </Col>
          </Form.Row>
        </Form>
      )
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <div className='main authMain'>
        { this.MainFields() }
        { this.MFASetup() }
        { this.Confirm()}
      </div>
    )
  }
}

//const Login = connect(null, mapDispatchToProps)(ConnectedLogin);
export default Login;