import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import fieldBind from './login.fields';
import { logicConstructor } from './login.logic/Login.logic'
import SectionTitle from './../../../utils/sectionTitle'
import defined from './../../../utils/defined'
import './../Auth.scss'

class Login extends Component {
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