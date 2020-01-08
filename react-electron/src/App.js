import React, { Component } from 'react';
import { connect } from "react-redux";
import { addArticle } from "./js/actions/index"
import APIPayloadCreator from "./js/components/api_call/api_payload_creator"
import './App.css';
import List from "./js/components/List";
import { Form, Col, Button } from 'react-bootstrap';

import initialData from './js/components/dnd_list/initial-data';
import Column from  './js/components/dnd_list/column';
import { DragDropContext } from 'react-beautiful-dnd';

const uuidv4 = window.require("uuid/v4")

var electron = window.require("electron");
var remote = electron.remote;
var dialog = remote.dialog;

function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
}

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      id: "",
      title: "",
      jobNumber: "",
      sourceFiles: initialData,
      orderType: "QuickSync",
      priorityOptions: ["1", "2"],
      priority: "1",
      notes: ""
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickBrowse = this.handleClickBrowse.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragUpdate = this.onDragUpdate.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.updatePriorityOptions = this.updatePriorityOptions.bind(this);
  }

  async handleClickBrowse() {
    var browseButtonResponse = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
    var selectedFiles = await browseButtonResponse.filePaths;

    // Get the maximum id of the files that are already on the list
    var maxDocId = 0;
    Object.keys(this.state.sourceFiles.docs).forEach((key, index) => {
      var currentId = key.split('-')[1];
      if (currentId > maxDocId) {
        maxDocId = currentId;
      }
    })

    // Create a new copy of docs already on the list, and add newly selected files
    // Also add all of these files to the list of docIds for column-1
    var newDocs = {...this.state.sourceFiles.docs}
    var newColumnOneDocIds = [...this.state.sourceFiles.columns["column-1"].docIds]

    Object.values(selectedFiles).forEach((value) => {
      maxDocId++;
      var newKey = "doc-" + (maxDocId);
      
      newDocs[newKey] = {id: newKey, content: value};
      newColumnOneDocIds.push(newKey);
    });
    // Use our newDocs and NewColumnOneDocIds to create our new state
    const newState = {
      ...this.state,
      sourceFiles: {
        docs: newDocs,
        columns: {
          ...this.state.sourceFiles.columns,
          'column-1': {
            id: this.state.sourceFiles.columns["column-1"].id,
            title: this.state.sourceFiles.columns["column-1"].title,
            docIds: newColumnOneDocIds
          }
        },
        columnOrder: Array.from(this.state.sourceFiles.columnOrder)
      },
    };

    this.setState(newState);
  }

  updatePriorityOptions(event) {
    if (event.target.id === "orderType") {
      var options = ["1", "2"];
      var priority = this.state.priority;

      if (event.target.value === "normal") {
        options.push("3");
        options.push("4");
      }
      else if (this.state.priority === "3" || this.state.priority === "4") {
        priority = "1";
      }

      var newState = {
        ...this.state,
        orderType: event.target.value,
        priority: priority,
        priorityOptions: options
      }

      this.setState(newState)
    }
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });

    this.updatePriorityOptions(event);
  }

  handleSubmit(event) {
    event.preventDefault();
    let payloadCreator = new APIPayloadCreator({
      externalJobNumber: this.state.jobNumber,
      deponentFirstName: "deponentFirstName",
      deponentLastName: "deponentLastName",
      depositionDate: "",
      caseName: "caseName",
      caseNumber: "caseNumber",
      jobInputPath: "jobInputPath",
      jobOutputPath: "jobOutputPath",
      orderType: this.state.orderType,
      fileList_raw: this.state.sourceFiles,
      priority: this.state.priority,
      assignedUserEmail: "assignedUserEmail",
      imageType: 1,
      createImage: 1,
      contactName: "contactName",
      contactEmail: "contactEmail",
      contactPhone: "contactPhone",
      allowedConfidenceLevelPercent: 70,
      fileOrder: this.state.sourceFiles.columns["column-1"].docIds
    });
    this.props.addArticle(
      {
        id: uuidv4(),
        title: this.state.title,
        jobNumber: this.state.jobNumber,
        sourceFiles: this.state.sourceFiles,
        orderType: this.state.orderType,
        priority: this.state.priority,
        notes: this.state.noter,
        payloadCreator: payloadCreator
      }
    );
    this.setState(
      { 
        id: "",
        title: "",
        jobNumber: "",
        sourceFiles: initialData,
        orderType: "QuickSync",
        priority: "1",
        priorityOptions: ["1", "2"],
        notes: ""
      }
    )
  }

  onDragStart = () => {
    //this.style.color = 'orange';
    //this.style.transition = 'background-color 0.2s ease'
  };

  onDragUpdate = update => {
    //const { destination } = update;
    //const opacity = destination
    //  ? destination.index / Object.keys(this.state.sourceFiles.docs).length
    //  : 0;
    //this.style.backgroundColor = 'rgba(153, 141, 217, ${opacity})';

  }

  onDragEnd = result => {
    //this.style.color = 'black';
    //this.style.backgroundColor = 'beige';
    const { destination, source, draggableId } = result;

    if (
      destination &&
      destination.droppabbleId &&
      destination.droppableId === source.droppableId &&
      destination.Index === source.index
    ) {
      return;
    }

    const column = this.state.sourceFiles.columns[source.droppableId]
    let newDocs = this.state.sourceFiles.docs;
    const newDocIds = Array.from(column.docIds);
    newDocIds.splice(source.index, 1);
    if (destination) { //this if statement allows us to delete items if they
                       // are dropped outside of a droppable item
      
      newDocIds.splice(destination.index, 0, draggableId);
    }
    else {
      delete newDocs[draggableId];
    }

    const newColumn = {
      ...column,
      docIds: newDocIds,
    };

    const newState = {
      ...this.state,
      sourceFiles: {
        docs: newDocs,
        columns: {
          ...this.state.sourceFiles.columns,
          [newColumn.id]: newColumn,
        },
        columnOrder: Array.from(this.state.sourceFiles.columnOrder)
      },
    };

    this.setState(newState);
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
                    <option>normal</option>
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