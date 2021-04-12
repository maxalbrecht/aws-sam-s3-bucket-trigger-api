import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './mpegConversion.fields/mpegConversion.fields'
import { mapDispatchToProps, logicConstructor } from './mpegConversion.logic/MpegConversion.logic'
import SectionTitle from './../../utils/sectionTitle'
import MpegConversionVeriSuiteJobsList  from './../mpegConversionVeriSuiteJobsList/MpegConversionVeriSuiteJobsList'

class ConnectedMpegConversion extends Component {
  constructor(props){
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
            <Col xs={6} style={{paddingBottom:'20px', display:'flex', flexDirection:'column'}}>
              <Form.Row style={{maxHeight:'35px'}}>{ SectionTitle('MPEG1 Conversion' ) }</Form.Row>
              <Form.Row style={{marginTop:'15px'}}>{ this.SourceFields() }</Form.Row>
              <Form.Row style={{maxHeight:'20px'}}>{ this.FormErrors() }</Form.Row>
              <Form.Row style={{maxHeight:'35px'}}>{ this.MpegConversionButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <MpegConversionVeriSuiteJobsList />
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

const MpegConversion = connect(null, mapDispatchToProps)(ConnectedMpegConversion)
export default MpegConversion