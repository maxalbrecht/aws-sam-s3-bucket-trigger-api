import React from 'react';
import { Form, Col } from 'react-bootstrap';
//import BrowseButton from './browseButton';
import JOB_ARCHIVING_CONSTANTS from '../../../constants/job-archiving';

const { SOURCE_BUCKETS, sourceToTargetBucketMappings } = JOB_ARCHIVING_CONSTANTS

function DestinationFields() {
  //this.BrowseButton = BrowseButton.bind(this);

  if(this.state.sourceBucket === SOURCE_BUCKETS.videoin01) {
    return (
      <Form.Group as={Col} className="textFieldLabel" 
        style={{borderWidth: '1px', borderColor: 'white', borderStyle:'solid', padding:'10px'}}
      >
        <div
         className='boxedGroupLabel'
         style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}>Destination</div>
        <Form.Row style={{maxHeight: '60px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>

          <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'130px', maxWidth:'130px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>{sourceToTargetBucketMappings[this.state.sourceBucket]}</Form.Label>
          </Form.Group> 

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
  else if(this.state.sourceBucket === SOURCE_BUCKETS.vxtzoom001) {
    return (
      <Form.Group as={Col} className="textFieldLabel" 
        style={{borderWidth: '1px', borderColor: 'white', borderStyle:'solid', padding:'10px'}}
      >
        <div
         className='boxedGroupLabel'
         style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}>Destination</div>
        <Form.Row style={{maxHeight: '60px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>

          <Form.Group as={Col} className="textFieldLabel" style={{minWidth:'130px', maxWidth:'130px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>{sourceToTargetBucketMappings[this.state.sourceBucket]}</Form.Label>
          </Form.Group> 

          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'1px', paddingRight:'1px', maxWidth:'8px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>/</Form.Label>
          </Form.Group>


          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'5px', paddingRight:'1px', minWidth:'50px', maxWidth:'50px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>zoom</Form.Label>
          </Form.Group> 


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
  else {
    let targetBucket = sourceToTargetBucketMappings[this.state.sourceBucket]

    return (
      <Form.Group as={Col} className="textFieldLabel" 
        style={{borderWidth: '1px', borderColor: 'white', borderStyle:'solid', padding:'10px'}}
      >
        <div
         className='boxedGroupLabel'
         style={{marginTop:'-25px', marginBottom:'10px', width:'88px', paddingLeft:'2px'}}>Destination</div>
        <Form.Row style={{maxHeight: '60px', marginBottom: '5px', borderWidth: '2px', borderColor: 'white' }}>

          <Form.Group as={Col} className="textFieldLabel" style={
            (targetBucket.length < 8 ? {minWidth:'55px', maxWidth:'55px'} : {minWidth:'80px', maxWidth:'80px'})
          }>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>{targetBucket}</Form.Label>
          </Form.Group> 

          <Form.Group as={Col} className="textFieldLabel" style={{padding:'0', paddingLeft:'1px', paddingRight:'1px', maxWidth:'8px'}}>
            <Form.Label style={{paddingTop:'35px', color: 'darkgrey'}}>/</Form.Label>
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
} 

export default DestinationFields;