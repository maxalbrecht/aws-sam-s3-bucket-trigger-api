import { mapStateToProps, logicConstructor } from './StitchedFile.logic/StitchedFile.logic'

import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'

import './StitchedFile.scss'
import fieldBind from './StitchedFile.fields/StitchedFile.fields'

import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
import { STITCHING_FILE, QUEUED, SUCCESS, ERROR } from './../../../constants/list_item_statuses'

import defined from './../../../utils/defined'
import Logging from '../../../utils/logging'

const uuidv4 = window.require("uuid/v4")

class ConnectedStitchedFile extends Component {
  constructor(props){
    super(props)

    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    let oddOrEven = ODD

    if(this.props.fileOrdinalNumber % 2 === 0){
      oddOrEven = EVEN
    }

    let successOrFailure = ''

    if(this.StitchedFileObject.fileStitcher.fileStitchingStatus === STITCHING_FILE
      || this.StitchedFileObject.fileStitcher.fileStitchingStatus === QUEUED){
      successOrFailure = ''
    }
    else if(this.StitchedFileObject.fileStitcher.fileStitchingStatus === SUCCESS){
      successOrFailure = SUCCESS
    }
    else if(this.StitchedFileObject.fileStitcher.fileStitchingStatus === ERROR){
      successOrFailure = FAILURE
    }

    let fileClasses = ''
    if(successOrFailure !== ''){
      fileClasses = successOrFailure + '_' + oddOrEven
    }

    return (
      <ListGroup.Item
        style={{borderTopWidth:'1px'}}
        className={
          'listItemGroupItem'
          + ' ' + fileClasses
        }
        key={this.StitchedFileObject.id}
      >
        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.StitchedFileObject.jobNumber}</Col>
        </Row>
        

        <Row className="AudioAdjustment">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Audio Adjustment:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            {this.StitchedFileObject.fileStitcher.audioAdjustment}
          </Col>
        </Row>
        
        <Row className="DestinationFileName">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Destination File Name:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            {this.StitchedFileObject.fileStitcher.ApiPayloadCreator.state.path_format}
          </Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.StitchedFileObject.fileStitcher.dateDisplay}</Col>
        </Row>

        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Stitching Service Response:</u></Col>
          <Col style={{padingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{this.StitchedFileObject.fileStitcher.fileStitchingStatus}</Row>
          </Col>
        </Row>

        <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              this.StitchedFileObject.fileStitcher.errorMsgList.map(
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

const StitchedFile = connect(mapStateToProps)(ConnectedStitchedFile)

export default StitchedFile




































