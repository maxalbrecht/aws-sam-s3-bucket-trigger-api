import React from 'react';
import { Form, Col } from 'react-bootstrap';

function Priority() {    
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Priority</Form.Label>
      <Form.Control as="select" 
        className="textField dropDown"
        id="priority"
        value={this.state.priority}
        onChange={this.handleChange}
      >
      {this.state.priorityOptions.map(option => 
        <option key={option} value={option}>{option}</option>
      )}
      </Form.Control>
    </Form.Group>
  )
} 

export default Priority;