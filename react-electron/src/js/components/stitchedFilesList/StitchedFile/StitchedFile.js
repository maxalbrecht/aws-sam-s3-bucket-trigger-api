import { mapStateToProps, logicConstructor } from './StitchedFile.logic/StitchedFile.logic'

import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'

import './StitchedFile.scss'
import fieldBind from './StitchedFile.fields/StitchedFile.fields'

import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
import { STITCHING_FILE, SUCCESS, ERROR } from './../../../constants/job_archiving_statuses'

import defined from './../../../utils/defined'

const uuidv4 = window.require("uuid/v4")

class ConnectedStitchedFile extends Component {
  constructor(props){
    super(props)

    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()

    if(defined(this.StitchedFileObject)){
      console.log("StitchedFileObject:")
      console.log(this.StitchedFileObject)
    }
    else {
      console.log("StitchedFileObject is not defined...")
    }
  }

  render() {
    let oddOrEven = ODD

    if(this.props.jobOrdinalNumber%2 ===0){
      oddOrEven = EVEN
    }

    let successOrFailure = ''

    if(this.StitchedFileObject.fileStitcher.fileStitchingStatus === STITCHING_FILE){
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
          <Col style={{maxWidth:'140px', padding:'0px'}}><ul>Job Number:</ul></Col>
          <Col style={{paddingLeft:'10px'}}>{this.StitchedFileObject.jobNumber}</Col>
        </Row>

        <Row className="JobNumber">
          <Col style={{malWidth:'140px', padding:'0px'}}><u>Source:</u></Col>
          <Col style={{padingLeft:'10px'}}>videoin02/{this.StitchedFileObject.jobNumber}</Col>
        </Row>

        <Row className="JobNumber">
          <Col style={{malWidth:'140px', padding:'0px'}}><u>Destination:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            videoin02/{this.StitchedFileObject.newFileName}
          </Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.StitchedFileObject.fileStitcher.dateDisplay}</Col>
        </Row>

        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Stitching Service Response:</u></Col>
          <Col style={{padingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{this.StitchedJobObject.fileStitchingStatus.fileStitchingStatus}</Row>
          </Col>
        </Row>

      </ListGroup.Item>
    )
  }
}

const StitchedFile = connect(mapStateToProps)(ConnectedStitchedFile)

export default StitchedFile




































