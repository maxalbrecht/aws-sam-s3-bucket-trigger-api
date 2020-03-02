import { mapDispatchToProps, logicConstructor } from './App.logic/App.logic'
import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import SubmittedJobsList from "../list/List";
import fieldBind from './fields';
import SectionTitle from '../../utils/sectionTitle';

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {
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
              <Form.Row style={{maxHeight:'80px'}}>{ this.JobNumber() }</Form.Row>
              <Form.Row>{ this.SourceFiles() }</Form.Row>
              <Form.Row style={{maxHeight:'80px'}}>{ this.OrderType() }{ this.Priority() }</Form.Row>
              <Form.Row style={{maxHeight:'130px'}}>{ this.Notes() }</Form.Row>
              <Form.Row style={{maxHeight:'40px'}}>{ this.SubmitJobButton() }</Form.Row>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <SubmittedJobsList />
            </Col>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);
export default App;