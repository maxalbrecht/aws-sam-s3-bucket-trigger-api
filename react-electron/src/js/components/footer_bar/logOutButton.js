import React from 'react';
import { Form, Button } from 'react-bootstrap'
import SectionTitle from './../../utils/sectionTitle'
import LogOut from './../../utils/logout'
import defined from './../../utils/defined'
var store = window.store

function LogOutButton() {
  if(defined(store.getState().user)) {
    return (
      <Button
            type="button"
            variant="secondary"
            onClick={ ()=>(LogOut(this)) }
            style={{
              fontSize: '14px',
              textAlign:'center',
              maxHeight:'20px',
              position:'absolute',
              left:'0px',
              top:'22px',
              marginTop:'0px',
              paddingTop:'0px',
              paddingBottom:'0px',
              background:'none',
              color:'lightgrey',
              borderColor:'lightgrey',
              width:'80px',
              zIndex:'100'
            }}
          >
            <Form.Label 
              style={{
                margin:0,
                padding: 0,
                position:'relative',
                top:'50%',
                transform: "translate(0px, -3px)",
                maxHeight:'20px',
                zIndex:'-1'
              }}
            >
              {SectionTitle('Log out', '14px')}
            </Form.Label>
          </Button>
    )
  }
  else {
    return null;
  }
}

export default LogOutButton;