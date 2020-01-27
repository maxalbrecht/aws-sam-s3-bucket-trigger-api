import React, { Component } from 'react';
import { Form, Col, Button} from 'react-bootstrap';
import { connect } from "react-redux";
import './App.css';
import SubmittedJobsList from "./../list/List";
import fieldBind from './fields';

import { DragDropContext } from 'react-beautiful-dnd';
import Column from  './../dnd_list/column';
import BrowseButton from './fields/browseButton';




import { addArticle } from "./../../../js/actions/index";
import APIPayloadCreator from "./../../../js/classes/api_call/api_payload_creator";
import APICaller from "./../../../js/classes/api_call/api_caller";
import User from "./../../../js/classes/user/user";
import Deposition from "./../../../js/classes/deposition/deposition";
import { ConvertPriorityStringToInt, ONE_DAY, TWO_DAYS, THREE_DAYS, FOUR_DAYS } from "./../../../js/constants/priority_options"
import { QuickSync, Manual } from "./../../../js/constants/order_types"

import './App.css';
import List from "./../../../js/components/list/List";

import initialData from './../../../js/components/dnd_list/initial-data';

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
      orderType: QuickSync,
      priorityOptions: [ONE_DAY, TWO_DAYS],
      priority: ONE_DAY,
      notes: "",
      user: new User(),
      deposition: new Deposition() 
    }
    console.log("initialData:");
    console.log(initialData);

    this.initialData = initialData;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickBrowse = this.handleClickBrowse.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragUpdate = this.onDragUpdate.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.updatePriorityOptions = this.updatePriorityOptions.bind(this);
    this.setDefaultPath = this.setDefaultPath.bind(this);
  }

  checkIfDirectoryExists(directory) {
    let fs = window.require("fs");
    try {
      fs.accessSync(directory);
      //console.log(`The following directory exists: ${directory}`);
      return true;
    }
    catch (e) {
      //console.log(`The following directory does not exist: ${directory}`);
      return false;
    } 
  }
  
  async setDefaultPath() {
    let defaultPath = "";
    let prodPath = "Y:";
    let testPath = "E:";
    let devPath = "C:";

    try {
      if (this.checkIfDirectoryExists(prodPath)) {
        defaultPath = `${prodPath}\\vxttest01`;
      }
      else if (this.checkIfDirectoryExists(testPath)) {
        defaultPath = testPath;
      }
      else if (this.checkIfDirectoryExists(devPath)) {
        let devTempPath = `${devPath}\\Users\\devops2\\Documents\\GitHub\\aws-sam-s3-bucket-trigger-api\\react-electron\\private\\test_jobs`;
        console.log(`dev temp path: ${devTempPath}`);
        if (this.checkIfDirectoryExists(devTempPath)) {
          defaultPath = devTempPath;
        }
      }

      let tempPath = `${defaultPath}\\${this.state.jobNumber}`;
      if ( this.checkIfDirectoryExists(tempPath)) {
        defaultPath = tempPath;
      }
    }
    catch (e) {
      console.log(`Error setting browse window default window. Error: ${e}`);
    }

    return defaultPath;
  }

  async handleClickBrowse() {
    let defaultPath = await this.setDefaultPath();

    var browseButtonResponse = 
      await dialog.showOpenDialog(
        {
          properties: ['openFile', 'multiSelections'],
          defaultPath: defaultPath
        }
      );
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
      var options = [ONE_DAY, TWO_DAYS];
      var priority = this.state.priority;

      if (event.target.value === Manual) {
        options.push(THREE_DAYS);
        options.push(FOUR_DAYS);
      }
      else if (this.state.priority === THREE_DAYS || this.state.priority === FOUR_DAYS) {
        priority = ONE_DAY;
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

  ReturnJobPath(inputOrOutput = "input") {
    let mainFolder = "vxttest01";
    let region = "region=us_east_1";
    let path = `aws://${mainFolder}/${this.state.jobNumber}?region=${region}`;
    
    return path;
  }

  handleSubmit(event) {
    event.preventDefault();
    let payloadCreator = new APIPayloadCreator({
      externalJobNumber: this.state.jobNumber,
      //deponentFirstName: this.state.deposition.deponentFirstName,
      //deponentLastName: this.state.deposition.deponentFirstName,
      //depositionDate: this.state.deposition.depositionDate,
      //caseName: this.state.deposition.caseName,
      //caseNumber: this.state.deposition.caseNumber,
      jobInputPath: this.ReturnJobPath(),
      jobOutputPath: this.ReturnJobPath("output"),
      orderType: this.state.orderType,
      fileList_raw: this.state.sourceFiles,
      priority: ConvertPriorityStringToInt(this.state.priority),
      assignedUserEmail: this.state.user.assignedUserEmail,
      imageType: 1,
      createImage: 1,
      contactName: this.state.user.contactName,
      contactEmail: this.state.user.contactEmail,
      contactPhone: this.state.user.contactPhone,
      allowedConfidenceLevelPercent: 70,
      fileOrder: this.state.sourceFiles.columns["column-1"].docIds
    });

    let apiCaller = new APICaller(payloadCreator.formattedAPIPayload);

    this.props.addArticle(
      {
        id: uuidv4(),
        title: this.state.title,
        jobNumber: this.state.jobNumber,
        sourceFiles: this.state.sourceFiles,
        orderType: this.state.orderType,
        priority: this.state.priority,
        notes: this.state.noter,
        payloadCreator: payloadCreator,
        apiCaller: apiCaller
      }
    );

    this.setState(
      { 
        id: "",
        title: "",
        jobNumber: "",
        sourceFiles: initialData,
        orderType: QuickSync,
        priority: ONE_DAY,
        priorityOptions: [ONE_DAY, TWO_DAYS],
        notes: "",
        user: this.state.user,
        deposition: new Deposition() 
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
   const { destination, source, draggableId } = result;

   if(!destination) {
     console.log("item dropped outside droppable...");
     return;
   }

    if(destination.droppableId === source.droppableId &&
    destination.index === source.index){
      console.log("item dropped in the same position it had at the start of the dragging action...");
      return;
    }

    const column = this.state.sourceFiles.columns[source.droppableId]
    const newDocIds = Array.from(column.docIds);
    newDocIds.splice(source.index, 1);
    newDocIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      docIds: newDocIds
    }

    const newState = {
      ...this.state,
      sourceFiles: {
        ...this.state.sourceFiles,
        columns: {
          ...this.state.columns,
          [newColumn.id]:newColumn
        }

      }
      
    }
    console.log("current state:");
    console.log(this.state);
    console.log("new state:");
    console.log(newState);

    this.setState(newState);
  
  }

  render() {
    this.state.sourceFiles = initialData;

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
              <DragDropContext onDragEnd={this.onDragEnd}>
              {

                this.initialData.columnOrder.map(columnId => {
                  const column = this.initialData.columns[columnId];
                  console.log("column:");
                  console.log(column);
                  const docs = column.docIds.map(docId => this.initialData.docs[docId]);

                  return <Column key={column.id} column={column} docs={docs} />
                })
              }
              </DragDropContext>
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