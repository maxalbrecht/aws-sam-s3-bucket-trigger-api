import React, { Component } from 'react'
import { Container, Row } from 'react-bootstrap'
import './JobStatus.scss'
import fieldBind from './fields'
import { logicConstructor } from './JobStatus.logic/JobStatus.logic'

class JobStatus extends Component {
  constructor(props) {
    super(props)
    logicConstructor.bind(this)(props)
    fieldBind.bind(this)()

    //^^//console.log("JobStatus state:")
    //^^//console.log(this.state)
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
      <Row className="dropdownRow">Job Status: QC</Row>
        <Row className='jobStatusRow'>{ this.TaskAssignmentGrid() }</Row>
      </Container>
    )
  }
}

export default JobStatus