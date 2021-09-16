import React from 'react';
import { Form, Col } from 'react-bootstrap';

function Year() {    
  return (
    <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'80px'}}>
      <Form.Label>Year</Form.Label>
      <Form.Control as="select" 
        className="textField dropDown"
        id="year"
        value={this.state.year}
        onChange={this.handleChange}
      >
        <option></option>
        <option>2005</option>
        <option>2006</option>
        <option>2007</option>
        <option>2008</option>
        <option>2009</option>
        <option>2010</option>
        <option>2011</option>
        <option>2012</option>
        <option>2013</option>
        <option>2014</option>
        <option>2015</option>
        <option>2016</option>
        <option>2017</option>
        <option>2018</option>
        <option>2019</option>
        <option>2020</option>
        <option>2021</option>
      </Form.Control>
    </Form.Group>
  )
  } 

export default Year;