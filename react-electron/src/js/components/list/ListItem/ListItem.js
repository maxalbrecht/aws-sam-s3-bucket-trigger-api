import { mapStateToProps, logicConstructor } from './ListItem.Logic/ListItem.Logic'

import React, { Component } from 'react';
import { ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'

import './ListItem.scss';
import Collapse from '@kunukn/react-collapse'
import fieldBind from './fields'

//var store = window.store;
const uuidv4 = window.require("uuid/v4")

class ConnectedListItem extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {
    let borderColor = this.selectStatusColor();
    let backgroundColor = this.selectBackgroundColor();

    return (
      <ListGroup.Item style={{borderTopWidth:'1px', borderColor:borderColor, backgroundColor:backgroundColor}} className="listItemGroupItem" key={this.ListItemObject.ListItemId} >
        
        <Row className="JobNumber">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.ListItemObject.jobNumber}</Col>
        </Row>

        <Row className="TimeSubmitted">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.ListItemObject.apiCaller.dateDisplay}</Col>
        </Row>

        <Row className="SubmissionResponse">
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Submission Response:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{this.ListItemObject.apiCaller.APICallStatus}</Row>
          </Col>
        </Row>

        <Row className="ErrorMsgList" style={{margin:'0 0'}}>
          <ListGroup style={{border:'none'}}>
            {
              this.ListItemObject.apiCaller.errorMsgList.map(
                errorMsgObject => (
                  <ListGroup.Item style={{padding:'2px 0', border:'none'}} key={uuidv4()}>
                    {errorMsgObject.errorMsg}
                  </ListGroup.Item>
                )
              )
            }
          </ListGroup>
        </Row>
        { this.JobDetails() }
      </ListGroup.Item>
    )
  }
}

const ListItem = connect(mapStateToProps)(ConnectedListItem);

export default ListItem;