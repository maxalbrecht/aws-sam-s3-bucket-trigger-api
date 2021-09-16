import React from 'react'
import { Form, Col } from 'react-bootstrap'
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving'

const { SOURCE_BUCKETS } = JOB_ARCHIVING_CONSTANTS

function SourceBucket() {
  return (
    <Form.Group as={Col} className="textFieldLabel" style={{ minWidth:'140px', maxWidth:'140px'}}>
      <Form.Label style={{paddingBottom: '8px'}}>Bucket</Form.Label>
      <Form.Control as="select"
        className="textField dropDown"
        id="sourceBucket"
        value={this.state.sourceBucket}
        onChange={this.handleChange}
      >
        <option>{SOURCE_BUCKETS.vxtprod}</option>
        <option>{SOURCE_BUCKETS.videoin01}</option>
        <option>{SOURCE_BUCKETS.vxtzoom001}</option>
      </Form.Control>
    </Form.Group>
  )
}

export default SourceBucket