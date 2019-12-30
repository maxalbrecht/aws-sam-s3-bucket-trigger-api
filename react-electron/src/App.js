import React, { Component } from 'react';
import { connect } from "react-redux";
import { addArticle } from "./js/actions/index"
import './App.css';
import List from "./js/components/List";
import { Form, Col, Button } from 'react-bootstrap';

function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
}

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "titleConstructor",
      jobNumber: -1,
      sourceFiles: {},
      orderType: "orderTypeConstructor",
      priority: "priorityConstructor",
      notes: "notesConstructor"
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log("state:");
    console.log(this.state);
    console.log("title:");
    console.log(this.state.title);
    console.log("jobNumber:");
    console.log(this.state.jobNumber);
    console.log("notes:");
    console.log(this.state.notes);
    this.props.addArticle(
      {
        title: this.state.title,
        jobNumber: this.state.jobNumber,
        sourceFiles: this.state.sourceFiles,
        orderType: this.state.orderType,
        priority: this.state.priority,
        notes: this.state.notes
      }
    );
    this.setState(
      { 
        title: "titleSetState",
        jobNumber: 0,
        sourceFiles: {},
        orderType: "orderTypeSetState",
        priority: "prioritySetState",
        notes: "notesSetState"
      }
    )
  }

  render() {
    const { title } = this.state.title;
    const { jobNumber } = this.state.jobNumber;
    const { orderType } = this.state.orderType;

    return (
      <div className="App">
        <Form className="AppForm" xs={12} onSubmit={this.handleSubmit}>
          <Form.Row xs={12}>
            <Col xs={6}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridJobNumber" className="textFieldLabel">
                  <Form.Label>Job Number</Form.Label>
                  <Form.Control 
                    placeholder="Enter Job Number" 
                    className="textField"
                    value={jobNumber}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formFilesGroup" className="textFieldLabel">
                  <Form.Row>
                    <Col>
                      <Form.Label className="formNotes">Source Files</Form.Label>
                    </Col>
                    <Col className="formBrowseButtonCol">
                      <Button variant="secondary" className="formBrowseButton">
                        Browse...
                      </Button>
                    </Col>     
                  </Form.Row>
                  <Form.Control as="textarea" rows="3" className="textField sourceFilesField" />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridOrderType" className="textFieldLabel">
                  <Form.Label>Order Type</Form.Label>
                  <Form.Control as="select" 
                    className="textField dropDown"
                    value={orderType}
                    onChange={this.handleChange}
                  >
                    <option></option>
                    <option>...</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="formPriority" className="textFieldLabel">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control as="select" className="textField dropDown">
                    <option className="textFieldDefault"></option>
                    <option>...</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formNotesGroup" className="textFieldLabel">
                  <Form.Label className="formNotes">Notes</Form.Label>
                  <Form.Control as="textarea" rows="3" className="textField" />
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
