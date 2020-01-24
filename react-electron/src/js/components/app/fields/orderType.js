import React from 'react';
import { Form, Col } from 'react-bootstrap';

function OrderType() {    
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label>Order Type</Form.Label>
      <Form.Control as="select" 
        className="textField dropDown"
        id="orderType"
        value={this.state.orderType}
        onChange={this.handleChange}
      >
        <option>QuickSync</option>
        <option>Manual</option>
      </Form.Control>
    </Form.Group>
  )
  } 

export default OrderType;