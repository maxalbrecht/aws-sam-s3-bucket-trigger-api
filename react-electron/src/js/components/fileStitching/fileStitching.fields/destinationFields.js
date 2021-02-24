import React from 'react'
import { Form, Col } from 'react-bootstrap'

function DestinationFields() {

  return (
    <Form.Group as={Col} className="textFieldLabel boxedGroupBorder"
      style={{borderWidth:'1px', borderStyle:'solid', padding:'10px'}}
    >
      <div
        className='boxedGroupLabel'
        style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}
      >Destination</div>

      <Form.Row style={{maxHeight:'35px', marginBottom:'5px', borderWidth:'2px', borderColor:'white'}}>
        { this.AudioAdjustment() }
      </Form.Row>
      <Form.Row style={{maxHeight:'60px', marginTop:'25px', marginBottom:'5px', borderWidth:'2px', borderColor:'white'}}>
        <Form.Group as={Col} className="textFieldLabel" style={{maxWidth:'80px'}}>
          <Form.Label
            style={{paddingTop:'35px', color:'darkgrey'}}
          >vxtprod/</Form.Label>
        </Form.Group>
        { this.DestinationFileName() }
      </Form.Row>

    </Form.Group>
  )
}

export default DestinationFields