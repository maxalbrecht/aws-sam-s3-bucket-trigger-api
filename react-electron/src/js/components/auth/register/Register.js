import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Col } from 'react-bootstrap';
import fieldBind from './Register.fields';
import { logicConstructor } from './Register.logic/Register.logic'
import SectionTitle from './../../../utils/sectionTitle'
import './../Auth.css'

class Register extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }
  
  render() {
    console.log("Register render() this:");
    console.log(this);

    return (
      <div className='main authMain'>
        <Form className="form" 
          onSubmit={this.handleSubmit}
        >
          <Form.Row>
            <Col>
              { SectionTitle('Register') }
              { this.FormErrors() }
              <Form.Row>{ this.Username() }</Form.Row>
              <Form.Row>{ this.Email() }</Form.Row>
              <Form.Row>{ this.Password() }</Form.Row>
              <Form.Row>{ this.PasswordConfirm() }</Form.Row>
              { this.RegisterButton() }
              <Form.Row className='App-link-row'>
                <Link className="App-link" to="/login">
                  Log In
                </Link>
              </Form.Row> 
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

//const Register = connect(null, mapDispatchToProps)(ConnectedRegister);
export default Register;