import React from 'react'
import { Form, Col } from 'react-bootstrap'

function DestinationFields() {

  return (
    <Form.Group as={Col} className="textFieldLabel"
      style={{borderWidth:'1px', borderColor:'white', borderStyle:'solid', padding:'10px'}}
    >
      <div
        className='boxedGroupLabel'
        style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}
      >Destination</div>

      <Form.Row style={{maxHeight:'60px', marginBottom:'5px', borderWidth:'2px', borderColor:'white'}}>
        <Form.Group as={Col} className="textFieldLabel" style={{maxWidth:'55px'}}>
          <Form.Label
            style={{paddingTop:'35px', color:'darkgrey'}}
          >videoin02/</Form.Label>
        </Form.Group>
        
        <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'55px'}}>
          <Form.Label style={{paddingTop:'35px', color:'darkgrey'}}>{this.state.jobNumber}</Form.Label>
        </Form.Group>
      </Form.Row>

    </Form.Group>
  )
}

export default DestinationFields