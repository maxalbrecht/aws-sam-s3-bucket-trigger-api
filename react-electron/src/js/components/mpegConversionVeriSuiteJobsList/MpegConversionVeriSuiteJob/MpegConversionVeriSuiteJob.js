import { mapStateToProps, logicConstructor } from './MpegConversionVeriSuiteJob.logic/MpegConversionVeriSuiteJob.logic' 
import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import './MpegConversionVeriSuiteJob.scss'
import fieldBind from './MpegConversionVeriSuiteJob.fields/MpegConversionVeriSuiteJob.fields'
//import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
//import { PROCESSING, QUEUED, SUCCESS, ERROR } from './../../../constants/list_item_statuses'

const uuidv4 = window.require("uuid/v4")

class ConnectedMpegConversionVeriSuiteJob extends Component {
  constructor(props) {
    super(props)

    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    let veriSuiteJobClasses = this.getClassNamesForColorCoding(this.MpegConversionVeriSuiteJobObject.mpegConverter.mpegConversionStatus, this.props.veriSuiteJobOrdinalNumber)

    return (
      <ListGroup.Item
        style={{borderTopWidth: '1px'}}
        className={
          'listItemGroupItem'
          + ' ' + veriSuiteJobClasses
        }
        key={this.MpegConversionVeriSuiteJobObject.id}
      >
        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.MpegConversionVeriSuiteJobObject.jobNumber }</Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.MpegConversionVeriSuiteJobObject.mpegConverter.dateDisplay }</Col>
        </Row>

        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Status:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{ this.MpegConversionVeriSuiteJobObject.mpegConverter.mpegConversionStatus }</Row>
          </Col>
        </Row>

        <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              this.MpegConversionVeriSuiteJobObject.mpegConverter.errorMsgList.map(
                errorMsgObject => (
                  <ListGroup.Item style={{padding:'2px 0', border:'none'}} key={uuidv4()}>
                    {errorMsgObject.errorMsg}
                  </ListGroup.Item>
                )
              )
            }
          </ListGroup>
        </Row>
        { this.JobDetails() }
      </ListGroup.Item>
    )
  }
}

const MpegConversionVeriSuiteJob = connect(mapStateToProps)(ConnectedMpegConversionVeriSuiteJob)

export default MpegConversionVeriSuiteJob