import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import fieldBind from './changePassword.fields/';
import { logicConstructor } from './changePassword.logic/ChangePassword.logic'
import SectionTitle from './../../../utils/sectionTitle'
import './../Auth.css'

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {
    return (
      <div className='main authMain'>
        <Form className='form'
          onSubmit={this.handleSubmit}
        >
          <Form.Row>
            <Col>
              { SectionTitle('Change Password') }
              { this.FormErrors() }
              <Form.Row>{ this.Username() }</Form.Row>
              <Form.Row>{ this.CurrentPassword() }</Form.Row>
              <Form.Row style={{minHeight:'15px'}} />
              <Form.Row>{ this.Password('New Password') }</Form.Row>
              <Form.Row>{ this.PasswordConfirm() }</Form.Row>
              { this.ChangePasswordButton() }
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

export default ChangePassword;