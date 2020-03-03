import React from 'react'
import { Form, Col } from 'react-bootstrap'
import defined from '../../../utils/defined';

function Password(customLabel) {
  let label = 'Password'

  if(defined(customLabel)) {
    label = customLabel
  }

  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="password"
        placeholder="Password"
        className="textField"
        id="password"
        value = {this.state.password}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
}

export default Password;