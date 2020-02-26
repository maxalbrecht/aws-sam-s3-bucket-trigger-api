import { mapStateToProps, logicConstructor } from './ListItem.Logic/ListItem.Logic'

import React, { Component } from 'react';
import { ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'

import './ListItem.scss';
import Collapse from '@kunukn/react-collapse'
import fieldBind from './fields'

import { ODD, EVEN, FAILURE } from './../../../constants/cssClassNames'
import { STARTING_JOB, SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from './../../../constants/list_item_statuses'
import defined from '../../../utils/defined';

//var store = window.store;
const uuidv4 = window.require("uuid/v4")

class ConnectedListItem extends Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
    fieldBind.bind(this)();
  }

  render() {
    let oddOrEven = ODD
    if(this.props.jobOrdinalNumber%2 === 0){
      oddOrEven = EVEN
    }

    let successOrFailure = ''

    if(this.ListItemObject.apiCaller.APICallStatus === STARTING_JOB) {
      successOrFailure = ''
    }
    else if(this.ListItemObject.apiCaller.APICallStatus === SUCCESS) {
      successOrFailure = SUCCESS
    }
    else if(
      this.ListItemObject.apiCaller.APICallStatus === ERROR
      || this.ListItemObject.apiCaller.APICallStatus === ERROR_API_NOT_RESOLVED
      
    ) {
      successOrFailure = FAILURE
    }

    let jobClasses = ''
    if(successOrFailure !== ''){
      jobClasses = successOrFailure + '_' + oddOrEven
    }

    return (
      <ListGroup.Item 
        style={{borderTopWidth:'1px'}} 
        className={
          'listItemGroupItem' 
          + ' ' + jobClasses
        } 

        key={this.ListItemObject.ListItemId} 
      >
        
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