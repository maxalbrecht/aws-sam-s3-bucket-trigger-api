import React, { Component } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from './../../constants/list_item_statuses'
import { COLOR_DEFAULT, COLOR_SUCCESS, COLOR_ERROR } from './../../constants/list_item_colors'
import './ListItem.css';

const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  let update = {};
  console.log("********************************************************************");
  console.log("Inside ListItem.mapStateToProps()...");
  console.log("ownProps:");
  console.log(ownProps);

  state.articles.forEach(listItem => {
    if (listItem.id === ownProps.ListItemObject.id) {
      console.log("matching listItem:");
      console.log(listItem);

      update = { APICallStatus: listItem.apiCaller.APICallStatus };
     
    }
  });
 
  console.log("ListItem.mapStateToProps.update:");
  console.log(update);
  
  return update;
}

class ConnectedListItem extends Component {
  constructor(props) {
    super(props);
    console.log("constructing ConnectedListItem...");
    this.ListItemObject = props.ListItemObject;
  }

  selectStatusColor() {
    let status = this.ListItemObject.apiCaller.APICallStatus;

    switch (status) {
      case SUCCESS:
        return COLOR_SUCCESS;
      case ERROR:
      case ERROR_API_NOT_RESOLVED:
        return COLOR_ERROR;
      default:
        return COLOR_DEFAULT;
    }
  }
  selectBackgroundColor() {
    let status = this.ListItemObject.apiCaller.APICallStatus

    switch (status) {
      case SUCCESS:
        return COLOR_SUCCESS;
      case ERROR:
        return COLOR_ERROR;
      default:
        return 'none';
    }
  }

  render() {
    let borderColor = this.selectStatusColor();
    let backgroundColor = this.selectBackgroundColor();

    return (
      <ListGroup.Item style={{borderTopWidth:'1px', borderColor:borderColor, backgroundColor:backgroundColor}} className="listItemGroupItem" key={this.ListItemObject.ListItemId} >
        <Row>
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Job Number:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.ListItemObject.jobNumber}</Col>
        </Row>

        <Row>
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Time Submitted:</u></Col>
          <Col style={{paddingLeft:'10px'}}>{this.ListItemObject.apiCaller.dateDisplay}</Col>
        </Row>

        <Row>
          <Col style={{maxWidth:'140px', padding:'0px'}}><u>Submission Response:</u></Col>
          <Col style={{paddingLeft:'10px'}}>
            <Row style={{margin:'0 0'}}>{this.ListItemObject.apiCaller.APICallStatus}</Row>
          </Col>
        </Row>

        <Row style={{margin:'0 0'}}>
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
      </ListGroup.Item>
    )
  }
}

const ListItem = connect(mapStateToProps)(ConnectedListItem);

export default ListItem;