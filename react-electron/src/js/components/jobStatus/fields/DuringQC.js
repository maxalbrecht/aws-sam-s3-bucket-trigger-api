import React from 'react'
import {Container, Row, Col } from 'react-bootstrap'

function DuringQC() {
  return(
    <Container fluid
      id='QCContainer'
    >
        <Col>
          Unassigned Jobs
        </Col>
        <Col>
          QC User 1
        </Col>
        <Col>
          QC User 2
        </Col>
        <Col>
          QC User 3
        </Col>
    </Container>
  )
}

export default DuringQC