import React from 'react'
import { Form, Col } from 'react-bootstrap'

function DestinationFileName() {
    return (
      <Form.Group as={Col} className="textFieldLabel">
        <Form.Label>File Name</Form.Label>
        <Form.Control 
          placeholder="Enter New File Name"
          className="textField"
          id="destinationFileName"
          value={this.state.destinationFileName}
          onKeyPress={
            event => { this.handleDestinationFileNamePressEnterKey(event) }
          }
          onChange={this.handleChange}
          maxLength='100'
        />
      </Form.Group>
    )
}

export default DestinationFileName