import React from 'react'
import { Form, Col } from 'react-bootstrap'

function JobNumber() {
  return (
    <Form.Group as={Col} className="textFieldLabel"
      style={{borderWidth:'1px', borderColor:'white', borderStyle:'solid', padding:'10px'}}
    >
      <div
        className='boxedGroupLabel'
        style={{marginTop:'-25px', marginBottom:'10px', width:'52px', paddingLeft:'2px'}}
      >Source</div>
      <Form.Row style={{maxHeight:'35px', marginBottom:'5px', borderWidth:'2px', borderColor: 'white'}}>
        <Col>
          <Form.Label>Job Number</Form.Label>
        </Col>
        <Col className="browseButtonCol">
        </Col>
      </Form.Row>
      <Form.Row>
        <Col style={{color:'darkgrey', maxWidth:'65px', paddingTop:'5px'}}>
          videoin02/
        </Col>
        <Col>
          <Form.Control 
            placeholder="Enter Job Number" 
            className="textField"
            id="jobNumber"
            value={this.state.jobNumber}
            onKeyPress={
              event => { this.handleJobNumberPressEnterKey(event) }
            }
            onChange={this.handleChange}
            maxLength='8'
          />
        </Col>
      </Form.Row>

    </Form.Group>
  )
}

export default JobNumber