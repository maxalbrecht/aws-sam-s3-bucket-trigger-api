import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './fileStitching.fields'
import { mapDispatchToProps, logicConstructor } from './fileStitching.logic/FileStitching.logic'
import SectionTitle from './../../utils/sectionTitle'
import defined from './../../utils/sectionTitle'
import StitchedFilesList from '../stitchedFilesList/StitchedFilesList'
import './FileStitching.scss'

class ConnectedFileStitching extends Component {
  constructor(props){
    super(props)
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  MainFields(){
    if(defined(this.state.cognitoUser)){
      return(
        <div style = {{height:'100%'}} className="main">
          <Form
            style={{
              height:'100%',
              display:'flex',
              flexDirection:'column'
            }}
            className="form" onSubmit={this.handleSubmit}
          >
            <Form.Row style={{height:'100%'}}>
              <Col xs={6} style={{padingBottom:'20px', display:'flex', flexDirection:'column'}}>
                { SectionTitle('File Stitching' )}
                { this.FormErrors() }
                <Form.Row>{ this.JobNumber() }</Form.Row>
                <Form.Row style={{marginTop:'15px'}}>{ this.DestinationFields() }</Form.Row>
                { this.StitchFileButton() }
              </Col>

              <Col xs={6} className="submittedJobsCol">
                <StitchedFilesList />
              </Col>
            </Form.Row>
          </Form>
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    return(
      <div className='main authMain'>
        { this.MainFields() }
      </div>
    )
  }
}

const FileStitching = connect(null, mapDispatchToProps)(ConnectedFileStitching)
export default FileStitching