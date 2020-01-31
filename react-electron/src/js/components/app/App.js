import { mapDispatchToProps, logicConstructor } from './App.logic/App.logic'
import React, { Component } from 'react';
import { Form, Col} from 'react-bootstrap';
import { connect } from "react-redux";
import './App.css';
import SubmittedJobsList from "../list/List";
import fieldBind from './fields';

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {
    return (
      <div style={{height:'100%'}} className="App">
        <Form style={{height:'100%'}} className="AppForm" onSubmit={this.handleSubmit}>
          <Form.Row style={{height:'100%'}}>
            <Col xs={6}>
              <Form.Row>{ this.JobNumber() }</Form.Row>
              <Form.Row>{ this.SourceFiles() }</Form.Row>
              <Form.Row>{ this.OrderType() }{ this.Priority() }</Form.Row>
              <Form.Row>{ this.Notes() }</Form.Row>
              { this.SubmitJobButton() }
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