import { mapStateToProps, logicConstructor } from './LocalDownloadVeriSuiteJob.logic/LocalDownloadVeriSuiteJob.logic'
import React, { Component } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import fieldBind from './LocalDownloadVeriSuiteJob.fields/LocalDownloadVeriSuiteJob.fields'

const uuidv4 = window.require("uuid/v4")

class ConnectedLocalDownloadVeriSuiteJob extends Component {
  constructor(props) {
    super(props)

    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    let veriSuiteJobClasses = this.getClassNamesForColorCoding(this.LocalDownloadVeriSuiteJobObject.localDownloader.localDownloadStatus, this.props.veriSuiteJobOrdinalNumber)

    return (
      <ListGroup.Item
        style={{borderTopWidth: '1px'}}
        className={
          'listItemGroupItem'
          + ' ' + veriSuiteJobClasses
        }
        key={this.LocalDownloadVeriSuiteJobObject.id}
      >
        <Row className="JobNumbers">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Numbers:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.LocalDownloadVeriSuiteJobObject.jobNumbers }</Col>
        </Row>

        <Row className="SourceFile">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Source File:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.LocalDownloadVeriSuiteJobObject.sourceFile }</Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{ this.LocalDownloadVeriSuiteJobObject.localDownloader.dateDisplay }</Col>
        </Row>

        <Row className="VeriSuiteJobStatus">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Download Status</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{ this.LocalDownloadVeriSuiteJobObject.localDownloader.veriSuiteJobStatus }</Row>
          </Col>
        </Row>

        <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              this.LocalDownloadVeriSuiteJobObject.localDownloader.errorMsgList.map(
                errorMsgObject => (
                  <ListGroup.Item style={{padding:'2px 0', border:'none'}} key={uuidv4()}>
                    { errorMsgObject.errorMsg }
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

const LocalDownloadVeriSuiteJob = connect(mapStateToProps)(ConnectedLocalDownloadVeriSuiteJob)

export default LocalDownloadVeriSuiteJob