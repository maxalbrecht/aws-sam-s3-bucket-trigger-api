import React, { Component } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
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

  render() {
    console.log(`rendering list item with id = ${this.ListItemObject.id}`);
    console.log("this List Item's ListItemObject:");
    console.log(this.ListItemObject);
    
    console.log("this.ListItemObject.apiCaller:");
    console.log(this.ListItemObject.apiCaller);
    
    console.log("this.ListItemObject.apiCaller.errorMsgList:");
    console.log(this.ListItemObject.apiCaller.errorMsgList);

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