import React from 'react';
import { Form, Col } from 'react-bootstrap';

function Notes() {
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Label className="formNotes">Notes</Form.Label>
      <Form.Control as="textarea" 
        rows="3" 
        className="textField"
        id="notes"
        value={this.state.notes}
        onChange={this.handleChange}
      />
    </Form.Group>
  )
} 

export default Notes;