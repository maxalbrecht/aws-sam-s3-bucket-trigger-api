import React from 'react'
import {Form, Col } from 'react-bootstrap'

function JobStatus() {
  return (
    <Form>
      <Form.Group as={Col} className="textFieldLabel">
        <Col>
          <Form.Label>Job Status:</Form.Label>
        </Col>
        <Col>
          <Form.Control
            as="select"
            className="textField dropDown"
            id="jobStatus"
            value={this.state.jobStatus}
            onChange={this.handleChange}
          >
            {this.state.jobStatusOptions.map(option =>
              <option key={option} value={option}>{option}</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>
    </Form>
  )
}

export default JobStatus