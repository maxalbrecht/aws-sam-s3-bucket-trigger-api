import React, { Component } from 'react'
import { Container, Row } from 'react-bootstrap'
import './JobStatus.scss'
import DuringQC from './fields/DuringQC'

class JobStatus extends Component {
  constructor(props) {
    super(props)
    this.DuringQC = DuringQC.bind(this)
  }
  render() {
    return (
      <Container
        style={{
          width:'100%',
          maxWidth:'none',
          height:'100%',
          minHeight:'100%',
          maxHeight:'none',
          marginLeft:0,
          marginRight:0,
          paddingLeft:0,
          paddingRight:0
        }} 
        id='jobStatusView'
        className='main jobStatusView'
      >
        <Row className='jobStatusRow'>{ this.DuringQC() }</Row>
        <Row className='jobStatusRow'>{ this.DuringQC() }</Row>
        <Row className='jobStatusRow'>{ this.DuringQC() }</Row>
      </Container>
    )
  }
}

export default JobStatus