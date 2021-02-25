import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './fileStitching.fields'
import { mapDispatchToProps, logicConstructor } from './fileStitching.logic/FileStitching.logic'
import SectionTitle from './../../utils/sectionTitle'
import StitchedFilesList from '../stitchedFilesList/StitchedFilesList'
import './FileStitching.scss'

class ConnectedFileStitching extends Component {
  constructor(props){
    super(props)
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    return(
      <div style={{height:'100%'}} className="main">
        <Form
          style={{
            height:'100%',
            display:'flex',
            flexDirection:'column'
          }}
          className="form" onSubmit={this.handleSubmit}
        >
          <Form.Row style={{height:'100%'}}>
            <Col xs={6} style={{paddingBottom:'20px', display:'flex', flexDirection:'column'}}>
              <Form.Row style={{maxHeight:'35px'}}>{ SectionTitle('File Stitching' ) }</Form.Row>
              <Form.Row style={{marginTop:'15px'}}>{ this.SourceFields() }</Form.Row>
              <Form.Row style={{marginTop:'15px', maxHeight:'150px'}}>{ this.DestinationFields() }</Form.Row>
              <Form.Row style={{maxHeight:'20px'}}>{ this.FormErrors() }</Form.Row>
              <Form.Row style={{maxHeight:'35px'}}>{ this.StitchFileButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <StitchedFilesList />
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

const FileStitching = connect(null, mapDispatchToProps)(ConnectedFileStitching)
export default FileStitching