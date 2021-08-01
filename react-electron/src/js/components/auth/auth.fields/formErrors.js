import React from 'react'
import { Form, Col } from 'react-bootstrap'
import CognitoErrorDisplay from './../auth.logic/cognitoErrorDisplay'
import BlankfieldErrorDisplay from './../auth.logic/blankfieldErrorDisplay'
import PasswordMatchErrorDisplay from './../auth.logic/passwordMatchErrorDisplay'
import Logging from './../../../utils/logging'

function FormErrors() {
  let errors = [];

  errors = errors
    .concat(CognitoErrorDisplay(this.state.errors.cognito))
    .concat(BlankfieldErrorDisplay(this.state.errors.blankfield))
    .concat(PasswordMatchErrorDisplay(this.state.errors.passwordmatch))
  ;
  let height='35px'

  Logging.log("auth.fields.formErrors.js.FormErrors() errors: ", errors, "this.state.errors:", this.state.errors)

    return (
      <Form.Group as={Col}
        className="textFieldLabel errorsFormGroup"
        style={{
          paddingLeft:'0px',
          fontSize:'12px',
          marginBottom:'4px',
          minHeight:height,
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

export default FormErrors;