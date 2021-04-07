import { mapStateToProps, logicConstructor } from './Mpeg1ConversionVeriSuiteJob.logic/Mpeg1ConversionVeriSuiteJob.logic' 
import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import './Mpeg1ConversionVeriSuiteJob.scss'
import fieldBind from './Mpeg1ConversionVeriSuiteJob.fields/Mpeg1ConversionVeriSuiteJob.fields'
//import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
//import { PROCESSING, QUEUED, SUCCESS, ERROR } from './../../../constants/list_item_statuses'

const uuidv4 = window.require("uuid/v4")

class ConnectedMpeg1ConversionVeriSuiteJob extends Component {
  constructor(props) {
    super(props)

    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    let veriSuiteJobClasses = this.getClassNamesForColorCoding(this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.mpeg1ConversionStatus, this.props.veriSuiteJobOrdinalNumber)

    return (
      <ListGroup.Item
        style={{borderTopWidth: '1px'}}
        className={
          'listItemGroupItem'
          + ' ' + veriSuiteJobClasses
        }
        key={this.Mpeg1ConversionVeriSuiteJobObject.id}
      >
        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.Mpeg1ConversionVeriSuiteJobObject.jobNumber }</Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.dateDisplay }</Col>
        </Row>

        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Status:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{ this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.mpeg1ConversionStatus }</Row>
          </Col>
        </Row>

        <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.errorMsgList.map(
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

const Mpeg1ConversionVeriSuiteJob = connect(mapStateToProps)(ConnectedMpeg1ConversionVeriSuiteJob)

export default Mpeg1ConversionVeriSuiteJob