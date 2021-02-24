import React from 'react'
import { Form, Col } from 'react-bootstrap'
import FILE_STITCHING_CONSTANTS from './../../../constants/file-stitching'

const ADJUSTMENTS = FILE_STITCHING_CONSTANTS.AUDIO_ADJUSTMENTS

function AudioAdjustment() {    
  return (
    <Form.Group as={Col} className="textFieldLabel">
      <Form.Row>
        <Col style={{maxWidth:'140px', padding:'0px'}}>
          <Form.Label>Audio Adjustment</Form.Label>
        </Col>
        <Col>
          <Form.Control as="select" 
            className="textField dropDown"
            id="audioAdjustment"
            value={this.state.audioAdjustment}
            onChange={this.handleChange}
          >
            <option>{ADJUSTMENTS._0}</option>
            <option>{ADJUSTMENTS.PLUS_3}</option>
            <option>{ADJUSTMENTS.PLUS_6}</option>
          </Form.Control>
        </Col>
      </Form.Row>
    </Form.Group>
  )
  } 

export default AudioAdjustment;