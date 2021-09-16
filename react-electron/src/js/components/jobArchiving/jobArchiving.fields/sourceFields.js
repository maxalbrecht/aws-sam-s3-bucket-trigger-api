import React from 'react';
import { Form, Col } from 'react-bootstrap';
import BrowseButton from './browseButton';
import SourceBucket from './sourceBucket'

function SourceFields() {
  this.BrowseButton = BrowseButton.bind(this);

    return (
      <Form.Group as={Col} className="textFieldLabel" 
        style={{borderWidth: '1px', borderColor: 'white', borderStyle:'solid', padding:'10px'}}
      >
        <div
         className='boxedGroupLabel'
         style={{marginTop:'-25px', marginBottom:'10px', width:'52px', paddingLeft:'2px'}}>Source</div>

        <Form.Row>
          { this.SourceBucket() }
          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'1px', paddingRight:'1px', maxWidth:'8px'}}>
            <Form.Label style={{ paddingTop:'43px', color: 'darkgrey'}}>/</Form.Label>
          </Form.Group> 




          <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'80px'}}>

        <Form.Row style={{maxHeight: '35px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
          <Col>
            <Form.Label>Job Number</Form.Label>
          </Col>
          <Col className="browseButtonCol">
            { this.BrowseButton() }
          </Col>

        </Form.Row>


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
          </Form.Group>



        </Form.Row>
      </Form.Group>
    )
  } 

export default SourceFields