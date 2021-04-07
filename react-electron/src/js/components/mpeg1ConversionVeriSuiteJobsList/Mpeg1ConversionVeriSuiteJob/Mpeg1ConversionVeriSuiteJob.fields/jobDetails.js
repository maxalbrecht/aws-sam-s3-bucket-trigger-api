import React from 'react'
import { ListGroup, Row, Col, Button, Form } from 'react-bootstrap'
import Logging from './../../../../utils/logging'
import Collapse from '@kunukn/react-collapse'

function JobDetails() {
  Logging.LogSectionStart("Inside Mpeg1ConversionVeriSuiteJob.JobDetails()")
  Logging.log("this.Mpeg1ConversionVeriSuiteJobObject:", this.Mpeg1ConversionVeriSuiteJobObject)

  let docs = this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.fileList
  let docsParsed = []
  for(var prop in docs) {
    if (Object.prototype.hasOwnProperty.call(docs, prop)) {
      let file = docs[prop].fileName

      docsParsed.push(file)
    }
  }

  Logging.log("docsParsed", docsParsed)

  Logging.LogSectionEnd()

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
          <Row className="SourceFilesTitle">
            <Col style={{maxWidth:'140px', padding:'0px'}}><u>Source Files</u></Col>
          </Row>
          <Row className="SourceFiles">
            <ListGroup style={{border:'none', paddingLeft:'20px'}}>
              {
                this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.fileList.map(
                  file => (this.SourceFile(file))
                )
              }
            </ListGroup>
          </Row>
        </Col>
      </Collapse>
    </React.Fragment>
  )
}

export default JobDetails