import React from 'react'
import { Form, Col } from 'react-bootstrap'

function CurrentPassword() {
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Current Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Current Password"
        className="textField"
        id="currentPassword"
        value = {this.state.currentPassword}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
}

export default CurrentPassword;