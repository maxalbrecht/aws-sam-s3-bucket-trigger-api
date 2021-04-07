import React from 'react'
import { Form, Col } from 'react-bootstrap'
import BlankfieldErrorDisplay from './../fileStitching.logic/blankFieldErrorDisplay'
import Logging from './../../../utils/logging'

function FormErrors() {
  let errors = []

  errors = errors
    .concat(BlankfieldErrorDisplay(this.state.errors.blankField))
  
  let height = '35px'

  return (
    <Form.Group
      className = "textFieldLabel errorsFormGroup"
      style={{
        paddingLeft:'0px',
        fontSize:'12px',
        marginBottom:'4px',
        minHeight:height
      }}
    >
      {
        errors.map((error) => (
          <Form.Row key={error} style={{color:'red', marginTop:'0px', marginBottom:'1px'}}>
            <Form.Label style={{marginBottom:'0px'}}>{error}</Form.Label>
          </Form.Row>
        ))
      }
    </Form.Group>
  )
}

export default FormErrors