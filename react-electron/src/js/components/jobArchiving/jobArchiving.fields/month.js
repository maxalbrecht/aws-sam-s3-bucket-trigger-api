import React from 'react';
import { Form, Col } from 'react-bootstrap';

function Month() {    
  return (
    <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'125px'}}>
      <Form.Label>Month</Form.Label>
      <Form.Control as="select" 
        className="textField dropDown"
        id="month"
        value={this.state.month}
        onChange={this.handleChange}
      >
        <option></option>
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
        <option>May</option>
        <option>June</option>
        <option>July</option>
        <option>August</option>
        <option>September</option>
        <option>October</option>
        <option>November</option>
        <option>December</option>
      </Form.Control>
    </Form.Group>
  )
  } 

export default Month;