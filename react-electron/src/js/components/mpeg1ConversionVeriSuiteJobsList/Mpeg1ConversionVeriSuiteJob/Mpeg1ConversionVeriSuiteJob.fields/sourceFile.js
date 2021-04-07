import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import Logging from './../../../../utils/logging'
import defined from './../../../../utils/defined'
const uuidv4 = window.require("uuid/v4")

function SourceFile(file) {
  Logging.LogSectionStart("Inside mpeg1ConversionVeriSuiteJob.SourceFile(file)...")
  Logging.log("file:", file, "file.fileConversionStatus:", file.fileConversionStatus)
  Logging.LogSectionEnd()

  if(!defined(file.errorMsgList)) {
    file.errorMsgList = []
  }

  return (
    <ListGroup.Item style={{padding:'2px 0', border:'none', marginBottom:'5px'}} key={uuidv4()}>
      <Row className="JobNumber">
        <Col style={{maxWidth:'140px', padding:'0px'}}><u>File Name:</u></Col>
        <Col style={{paddingLeft:'10px'}}>{ file.fileName }</Col>
      </Row>

      <Row className="TimeSubmitted">
        <Col style={{maxWidth:'140px', padding:'0px'}}><u>Status:</u></Col>
        <Col style={{paddingLeft:'10px'}}>{ file.fileConversionStatus }</Col>
      </Row>

      <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              file.errorMsgList.map(
                errorMsgObject => (
                  <ListGroup.Item style={{padding:'2px 0', border:'none'}} key={uuidv4()}>
                    { defined(errorMsgObject.errorMsg) ? errorMsgObject.errorMsg : errorMsgObject.error_class }
                  </ListGroup.Item>
                )
              )
            }
          </ListGroup>
        </Row>
    </ListGroup.Item>
  )
}

export default SourceFile