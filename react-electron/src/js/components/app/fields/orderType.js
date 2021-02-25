import React from 'react';
import { Form, Col } from 'react-bootstrap';
import FILE_SYNCING_CONSTANTS from './../../../constants/file-syncing'

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
        <option>{FILE_SYNCING_CONSTANTS.ORDER_TYPES.QUICK_SYNC}</option>
        <option>{FILE_SYNCING_CONSTANTS.ORDER_TYPES.MANUAL_SYNC}</option>
      </Form.Control>
    </Form.Group>
  )
  } 

export default OrderType;