import React from 'react';
import { ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import Logging from './../../../../utils/logging'

import { ConvertPriorityIntToString } from '../../../../constants/priority_options'
import Collapse from '@kunukn/react-collapse'

function JobDetails() {
  let docs = this.ListItemObject.sourceFiles.docs;
  let docsParsed = []
  Logging.LogSectionStart("Inside ListItem.JobDetails()")
  Logging.log("this.ListItemObject:", this.ListItemObject)
  Logging.LogSectionEnd()
  
  for (var prop in docs) {
    if (Object.prototype.hasOwnProperty.call(docs, prop)) {
      let file = docs[prop].content;
      
      docsParsed.push(file);
    }
  }

  return (
    <React.Fragment>
      <Row style={{padding:'0px'}}>
        <Col style={{maxWidth:'100px',paddingLeft:0, paddingRight:0}}>
          <u>Job Details:</u>
        </Col>
        <Button
          type="button"
          variant="secondary"
          onClick={this.handleToggleCollapse}
          style={{
            textAlign:'center',
            maxHeight:'10px',
            position:'relative',
            marginTop:'5px',
            background:'none',
            borderColor:'white',
            width:'35px'
          }}
        >
        <Form.Label style={{margin:0, padding: 0, height:'5px', position:'relative', top:'50%', transform: "translate(0px, -13px)"}}>
          { this.ToggleButtonLabel() }
        </Form.Label>
        </Button>
      </Row>
      <Collapse
        transition="height 300ms cubic-bezier(.4, 0, .2, 1)" 
        isOpen={this.JobDetailsIsOpen}
      >
        <Col style={{paddingLeft:'18px'}}>
          <Row className="OrderType">
            <Col style={{maxWidth:'140px', padding:'0px'}}><u>Order Type:</u></Col>
            <Col style={{paddingLeft:'10px'}}>
              <Row style={{margin:'0 0'}}>{this.ListItemObject.apiCaller.APIPayloadCreator.state.OrderType}</Row>
            </Col>
          </Row>

          <Row className="Priority">
            <Col style={{maxWidth:'140px', padding:'0px'}}><u>Priority:</u></Col>
            <Col style={{paddingLeft:'10px'}}>
              <Row style={{margin:'0 0'}}>
                { ConvertPriorityIntToString(
                    this.ListItemObject.apiCaller.APIPayloadCreator.state.Priority,
                    this.ListItemObject.apiCaller.APIPayloadCreator.state.OrderType
                  )
                }
              </Row>
            </Col>
          </Row>

          <Row className="Notes">
            <Col style={{maxWidth:'140px', padding:'0px'}}><u>Notes:</u></Col>
            <Col style={{paddingLeft:'10px'}}>
              <Row style={{margin:'0 0'}}>{this.ListItemObject.apiCaller.APIPayloadCreator.state.Notes}</Row>
            </Col>
          </Row>

          <Row className="SourceFilesTitle">
            <Col style={{maxWidth:'140px', padding:'0px'}}><u>SourceFiles:</u></Col>
          </Row>
          <Row className="SourceFiles">
            <ListGroup style={{border:'none', paddingLeft:'20px'}}>
              { 
                docsParsed.map(
                  file => (this.SourceFile(file))) 
              }
            </ListGroup>
          </Row>
        </Col>
      </Collapse>
    </React.Fragment>
  )
}

export default JobDetails;