import React from 'react';
import { Form, Col } from 'react-bootstrap';

function JobNumber() {
    return (
      <Form.Group as={Col} className="textFieldLabel">
        <Form.Label>Job Number</Form.Label>
        <Form.Control
          placeholder="Enter Job Number" 
          className="textField"
          id="jobNumber"
          value={this.state.jobNumber}
          onChange={this.handleChange}
          maxLength='8'
        />
      </Form.Group>
    )
  } 

export default JobNumber;