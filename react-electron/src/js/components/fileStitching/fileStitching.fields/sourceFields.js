import React from 'react'
import { Form, Col } from 'react-bootstrap'

function SourceFields() {
  return (
    <Form.Group as={Col} className="textFieldLabel boxedGroupBorder"
      style={{borderWidth:'1px', borderStyle:'solid', padding:'10px'}}
    >
      <div
        className='boxedGroupLabel'
        style={{marginTop:'-25px', marginBottom:'10px', width:'52px', paddingLeft:'2px'}}
      >Source</div>

          <Form.Row>{ this.JobNumber() }</Form.Row>
          <Form.Row
            style={{
              height:'calc(100% - 85px)'
            }} 
          >{this.SourceFiles() }</Form.Row>

    </Form.Group>
  )
}

export default SourceFields