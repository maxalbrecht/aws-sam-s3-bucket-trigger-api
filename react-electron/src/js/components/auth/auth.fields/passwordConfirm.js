import React from 'react'
import { Form, Col } from 'react-bootstrap'

function PasswordConfirm() {
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Password"
        className="textField"
        id="passwordConfirm"
        value = {this.state.passwordConfirm}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
}

export default PasswordConfirm;