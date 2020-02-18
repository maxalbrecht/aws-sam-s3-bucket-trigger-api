import React from 'react'
import SectionTitle from './../../../../utils/sectionTitle'
import { Form, Col } from 'react-bootstrap'
import defined from './../../../../utils/defined'

function Confirm() {
  const { cognitoUser, cognitoTOTPCode } = this.state;

  if(defined(cognitoUser) && !defined(cognitoTOTPCode)) {
    return (
      <Form className="form" 
        onSubmit={this.handleConfirm}
      >
        <Form.Row>
          <Col>
            { SectionTitle('Login') }
            { this.FormErrors() }
            <Form.Row>
              <Form.Group as={Col} className="textFieldLabel">
                <Form.Label>Confirmation Code</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmation Code"
                  className="textField"
                  id="confirm"
                  value = {this.state.confirm}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            { this.ConfirmButton() }
          </Col>
        </Form.Row>
      </Form>
    )
  }
  else {
    return null;
  }
}

export default Confirm;