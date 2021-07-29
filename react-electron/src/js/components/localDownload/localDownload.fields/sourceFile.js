import React from 'react'
import { Form, Col } from 'react-bootstrap'
import Logging from './../../../utils/logging'


function SourceFile() {
  Logging.debug("this:", this)
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Control
        placeholder="Click Browse and Select Source File"
        className="textField"
        id="sourceFile"
        value={this.state.sourceFile}
        maxLength='200'
      />
    </Form.Group>
  )
}

export default SourceFile
