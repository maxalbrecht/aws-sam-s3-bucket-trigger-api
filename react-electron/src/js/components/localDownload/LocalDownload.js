import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './localDownload.fields/localDownload.fields'
import { mapDispatchToProps, logicConstructor } from './localDownload.logic/LocalDownload.logic'
import SectionTitle from './../../utils/sectionTitle'

class ConnectedLocalDownload extends Component {
  constructor(props) {
    super(props)
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()
  }

  render() {
    return (
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
            <Col xs={6} style={{paddingBottom:'20px', display:'flex', flexDirection:'column', maxHeight:'300px'}}>
              <Form.Row style={{maxHeight:'35px'}}>{ SectionTitle('Local Download' ) }</Form.Row>
              <Form.Row style={{marginTop:'15px'}}>{ this.SourceFields() }</Form.Row>
              <Form.Row style={{maxHeight:'20px'}}>{ this.FormErrors() }</Form.Row>
              <Form.Row style={{maxHeight:'35px'}}>{ this.LocalDownloadButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
            </Col>
          </Form.Row>
          
        </Form>
      </div>
    )
  }
}

const LocalDownload = connect(null, mapDispatchToProps)(ConnectedLocalDownload)
export default LocalDownload