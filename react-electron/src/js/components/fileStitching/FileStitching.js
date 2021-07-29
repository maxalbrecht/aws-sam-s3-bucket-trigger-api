import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './fileStitching.fields'
import { mapDispatchToProps, logicConstructor } from './fileStitching.logic/FileStitching.logic'
import SectionTitle from './../../utils/sectionTitle'
import StitchedFilesList from '../stitchedFilesList/StitchedFilesList'
import './FileStitching.scss'

const FILE_STITCHING_QA_ROUTE = '/filestitchingqa'

const COMPONENT_VARIANTS = {
  standard: "STANDARD",
  qa: "QA"
}

class ConnectedFileStitching extends Component {
  constructor(props){
    super(props)
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
    this.currentPathName = this.props.history.location.pathname

    this.componentVariant = COMPONENT_VARIANTS.standard

    if(this.currentPathName === FILE_STITCHING_QA_ROUTE) {
      this.componentVariant = COMPONENT_VARIANTS.qa
    }

    this.componentVariantLabel = ''

    if(this.componentVariant === COMPONENT_VARIANTS.qa) {
      this.componentVariantLabel = ' ' + COMPONENT_VARIANTS.qa
    }

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
              <Form.Row style={{maxHeight:'35px'}}>{ SectionTitle('File Stitching' + this.componentVariantLabel ) }</Form.Row>
              <Form.Row style={{marginTop:'15px'}}>{ this.SourceFields() }</Form.Row>
              <Form.Row style={{marginTop:'15px', maxHeight:'150px'}}>{ this.DestinationFields() }</Form.Row>
              <Form.Row style={{maxHeight:'20px'}}>{ this.FormErrors() }</Form.Row>
              <Form.Row style={{maxHeight:'35px'}}>{ this.StitchFileButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <StitchedFilesList componentVariant={this.componentVariant} />
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

const FileStitching = connect(null, mapDispatchToProps)(ConnectedFileStitching)
export default FileStitching