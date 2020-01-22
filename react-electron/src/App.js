import React, { Component } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from  './js/components/dnd_list/column';
import List from "./js/components/list/List";
import './App.css';
import { connect } from "react-redux";

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

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = getConstructorState();

    this.mapDispatchToProps = mapDispatchToProps.bind(this);
    this.handleClickBrowse = handleClickBrowse.bind(this);
    this.updatePriorityOptions = updatePriorityOptions.bind(this);
    this.handleChange = handleChange.bind(this);
    this.handleSubmit = handleSubmit.bind(this);
    this.onDragStart = onDragStart.bind(this);
    this.onDragUpdate = onDragUpdate.bind(this);
    this.onDragEnd = onDragEnd.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Form className="AppForm" onSubmit={this.handleSubmit}>
          <Form.Row>
            <Col xs={6}>
              <Form.Row>
                <Form.Group as={Col} className="textFieldLabel">
                  <Form.Label>Job Number</Form.Label>
                  <Form.Control
                    placeholder="Enter Job Number" 
                    className="textField"
                    id="jobNumber"
                    value={this.state.jobNumber}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} className="textFieldLabel sourceFilesFormGroup">
                  <Form.Row>
                    <Col>
                      <Form.Label className="formNotes">Source Files</Form.Label>
                    </Col>
                    <Col className="formBrowseButtonCol">
                      <Button 
                        type="button"
                        variant="secondary"
                        className="formBrowseButton"
                        onClick={this.handleClickBrowse}
                      >
                        Browse...
                      </Button>
                    </Col>     
                  </Form.Row>
                    <DragDropContext
                      className="textField sourceFilesField"
                      onDragStart={this.onDragStart}
                      onDragUpdate={this.onDragUpdate}
                      onDragEnd={this.onDragEnd}
                    >
                      {this.state.sourceFiles.columnOrder.map((columnId) => {
                        const column = this.state.sourceFiles.columns[columnId];
                        const docs = column.docIds.map(docId => this.state.sourceFiles.docs[docId]);
                        
                        return <Column key={column.id} column={column} docs={docs} />;
                      })}
                    </DragDropContext>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} className="textFieldLabel">
                  <Form.Label>Order Type</Form.Label>
                  <Form.Control as="select" 
                    className="textField dropDown"
                    id="orderType"
                    value={this.state.orderType}
                    onChange={this.handleChange}
                  >
                    <option>QuickSync</option>
                    <option>Manual</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} className="textFieldLabel">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control as="select" 
                    className="textField dropDown"
                    id="priority"
                    value={this.state.priority}
                    onChange={this.handleChange}
                  >
                  {this.state.priorityOptions.map(option => 
                    <option key={option} value={option}>{option}</option>
                  )}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} className="textFieldLabel">
                  <Form.Label className="formNotes">Notes</Form.Label>
                  <Form.Control as="textarea" 
                    rows="3" 
                    className="textField"
                    id="notes"
                    value={this.state.notes}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>

              <Button variant="primary" type="submit" className="formSubmitButton">
                Submit Job
              </Button>
            </Col>

            <Col xs={6} className="submittedJobsCol">
              <Form.Label className="textFieldLabel">Submitted Jobs</Form.Label>
              <List />
            </Col>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);
export default App;