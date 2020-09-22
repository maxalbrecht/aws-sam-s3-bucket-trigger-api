import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, Col } from 'react-bootstrap';
import fieldBind from './jobArchiving.fields';
import {mapDispatchToProps, logicConstructor } from './jobArchiving.logic/JobArchiving.logic'
import SectionTitle from './../../utils/sectionTitle'
import defined from './../../utils/defined'
import ArchivedJobsList from '../archivedJobsList/ArchivedJobsList'
import './JobArchiving.scss'

class ConnectedJobArchiving extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  MainFields() {
    if(!defined(this.state.cognitoUser)){
      return (
        <div style={{height:'100%'}} className="main">
        <Form
          style={{
            height:'100%',
            display:'flex',
            flexDirection:'column',
          }} 
          className="form" onSubmit={this.handleSubmit}>
          <Form.Row style={{height:'100%'}}>
            <Col xs={6} style={{paddingBottom:'20px', display:'flex', flexDirection:'column'}}>
              { SectionTitle('Job Archiving') }
              { this.FormErrors() }
              <Form.Row>{ this.JobNumber() }</Form.Row>
              <Form.Row style={{marginTop:'15px'}}>{ this.DestinationFields() }</Form.Row>
              { this.ArchiveJobButton() }
            </Col>
            
            <Col xs={6} className="submittedJobsCol">
              <ArchivedJobsList />
            </Col>
          </Form.Row>
        </Form>
        </div>
      )
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <div className='main authMain'>
        { this.MainFields() }
      </div>
    )
  }
}

const JobArchiving = connect(null, mapDispatchToProps)(ConnectedJobArchiving);
export default JobArchiving;