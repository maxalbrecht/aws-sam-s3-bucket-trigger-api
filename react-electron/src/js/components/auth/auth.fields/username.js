import React from 'react'
import { Form, Col } from 'react-bootstrap'

function Username() {
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Username</Form.Label>
      <Form.Control
        placeholder="Username"
        className="textField"
        id="username"
        value = {this.state.username}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
}

export default Username;