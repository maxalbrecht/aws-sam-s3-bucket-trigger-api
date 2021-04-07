import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap'
import fieldBind from './mpeg1Conversion.fields/mpeg1Conversion.fields'
import { mapDispatchToProps, logicConstructor } from './mpeg1Conversion.logic/Mpeg1Conversion.logic'
import SectionTitle from './../../utils/sectionTitle'
import Mpeg1ConversionVeriSuiteJobsList  from './../mpeg1ConversionVeriSuiteJobsList/Mpeg1ConversionVeriSuiteJobsList'
import axios from 'axios'
import Logging from './../../utils/logging'

class ConnectedMpeg1Conversion extends Component {
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
              <Form.Row style={{maxHeight:'35px'}}>{ this.Mpeg1ConversionButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <Mpeg1ConversionVeriSuiteJobsList />
            </Col>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

const Mpeg1Conversion = connect(null, mapDispatchToProps)(ConnectedMpeg1Conversion)
export default Mpeg1Conversion
//export default ConnectedMpeg1Conversion