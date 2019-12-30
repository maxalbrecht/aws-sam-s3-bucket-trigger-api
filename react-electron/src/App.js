import React from 'react';
import './App.css';
import List from "./js/components/List";
import { Form, Col, Button } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Form className="AppForm" xs={12}>
        <Form.Row xs={12}>
          <Col xs={7}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridJobNumber" className="textFieldLabel">
                <Form.Label>Job Number</Form.Label>
                <Form.Control placeholder="Enter Job Number" className="textField" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formFilesGroup" className="textFieldLabel">
                <Form.Row>
                  <Col>
                    <Form.Label className="formNotes">Source Files</Form.Label>
                  </Col>
                  <Col className="formBrowseButtonCol">
                    <Button variant="secondary" type="submit" className="formBrowseButton">
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
                <Form.Control as="select" className="textField dropDown">
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
          <Col xs={1} />
          <Col xs={4}>
            <Form.Label className="textFieldLabel">Submitted Jobs</Form.Label>
            <List />
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}

export default App;
