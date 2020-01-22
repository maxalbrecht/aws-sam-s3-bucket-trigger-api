import React, { Component } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

function mapStateToProps(state, ownProps) {
  let update = {};
  console.log("********************************************************************");
  console.log("Inside ListItem.mapStateToProps()...");
  console.log("ownProps.ListItemObject:");
  console.log(ownProps.ListItemObject);

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

  render() {
    console.log(`rendering list item with id = ${this.ListItemObject.ListItemId}`);
    console.log("this List Item's ListItemObject:");
    console.log(this.ListItemObject);
    return (
      <ListGroup.Item className="listItemGroupItem" key={this.ListItemObject.ListItemId} >
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
          <Col style={{paddingLeft:'10px'}}>{this.ListItemObject.apiCaller.APICallStatus}</Col>
        </Row>
      </ListGroup.Item>
    )
  }
}

const ListItem = connect(mapStateToProps)(ConnectedListItem);

export default ListItem;