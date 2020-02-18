import React from 'react'
import { Form, Col } from 'react-bootstrap'
import CognitoErrorDisplay from './../auth.logic/cognitoErrorDisplay'
import BlankfieldErrorDisplay from './../auth.logic/blankfieldErrorDisplay'
import PasswordMatchErrorDisplay from './../auth.logic/passwordMatchErrorDisplay'

function FormErrors() {
  let errors = [];

  errors = errors
    .concat(CognitoErrorDisplay(this.state.errors.cognito))
    .concat(BlankfieldErrorDisplay(this.state.errors.blankfield))
    .concat(PasswordMatchErrorDisplay(this.state.errors.passwordmatch))
  ;
  let height='35px'

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