import React from 'react';
import { Form, Col } from 'react-bootstrap';
import BrowseButton from './browseButton';

function DestinationFields() {
  this.BrowseButton = BrowseButton.bind(this);

    return (
      <Form.Group as={Col} className="textFieldLabel" 
        style={{borderWidth: '1px', borderColor: 'white', borderStyle:'solid', padding:'10px'}}
      >
        <div
         className='boxedGroupLabel'
         style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}>Destination</div>
        <Form.Row style={{maxHeight: '60px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>
          <Form.Group as={Col} className="textFieldLabel" style={{maxWidth:'55px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>vxtarc/</Form.Label>
          </Form.Group> 
          { this.Year() }
          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'1px', paddingRight:'1px', maxWidth:'8px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>/</Form.Label>
          </Form.Group> 
          { this.Month() }
          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'1px', paddingRight:'1px', maxWidth:'8px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>/</Form.Label>
          </Form.Group> 
          <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'55px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>{this.state.jobNumber}</Form.Label>
          </Form.Group> 

 
        </Form.Row>
      </Form.Group>
    )
  } 

export default DestinationFields;