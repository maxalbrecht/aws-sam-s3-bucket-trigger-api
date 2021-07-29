import React from 'react'
import { Form, Col } from 'react-bootstrap'

function SourceFields () {
  return (
    <Form.Group as={Col} className="textFieldLabel boxedGroupBorder"
      style={{borderWidth:'1px', borderStyle:'solid', padding:'10px'}}
    >
      <div
        className='boxedGroupLabel'
        style={{marginTop:'-25px', marginBottom:'10px', width:'52px', paddingLeft:'2px'}}
      >Source</div>

      <Form.Row style={{maxHeight:'35px'}}>
        <Col>
          <Form.Label>Source File</Form.Label>
        </Col>
      </Form.Row>

      <Form.Row style={{maxHeight:'35px'}}>

        <Col>
          { this.SourceFile() }
        </Col>
        <Col className="browseButtonCol" style={{maxWidth:'90px'}}>
          <Form.Row style={{maxHeight:'35px'}}>
            { this.BrowseButton() }
          </Form.Row>
        </Col>
      </Form.Row>

    </Form.Group>
  )
}

export default SourceFields