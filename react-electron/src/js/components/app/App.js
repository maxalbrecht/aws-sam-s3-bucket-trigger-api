import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import SubmittedJobsList from "./../list/List";
import './App.css';
import { connect } from "react-redux";

// Importing logic functions
import {
  mapDispatchToProps,
  handleClickBrowse,
  updatePriorityOptions,
  handleChange,
  handleSubmit,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  getConstructorState
} from './AppFunctions'

// Importing UI Elements
import JobNumber from './fields/jobNumber'
import SourceFiles from './fields/sourceFiles'
import OrderType from './fields/orderType'
import Priority from './fields/priority'
import Notes from './fields/notes'
import SubmitJobButton from './fields/submitJobButton'

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = getConstructorState();

    // Binding imported logic functions
    this.mapDispatchToProps = mapDispatchToProps.bind(this);
    this.handleClickBrowse = handleClickBrowse.bind(this);
    this.updatePriorityOptions = updatePriorityOptions.bind(this);
    this.handleChange = handleChange.bind(this);
    this.handleSubmit = handleSubmit.bind(this);
    this.onDragStart = onDragStart.bind(this);
    this.onDragUpdate = onDragUpdate.bind(this);
    this.onDragEnd = onDragEnd.bind(this);

    // Binding imported UI Elements
    this.JobNumber = JobNumber.bind(this);
    this.SourceFiles = SourceFiles.bind(this);
    this.OrderType = OrderType.bind(this);
    this.Priority = Priority.bind(this);
    this.Notes = Notes.bind(this);
    this.SubmitJobButton = SubmitJobButton.bind(this);
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