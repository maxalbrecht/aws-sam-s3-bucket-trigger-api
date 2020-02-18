import React from 'react'
import { Form, Col } from 'react-bootstrap'

function Email() {
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Email</Form.Label>
      <Form.Control 
        type="email"
        placeholder="Email"
        className="textField"
        id="email"
        value = {this.state.email}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
}

export default Email;