import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom"
import { Form, Col, Row, Button } from 'react-bootstrap'
import LogOutButton from './logOutButton'
import './FooterBar.css'
import defined from '../../utils/defined'
import SectionTitle from './../../utils/sectionTitle'
import LogOut from './../../utils/logout'
var store = window.store;

function mapStateToProps(state, ownProps) {
  let update = {}

  if(
    defined(state.user)
    && defined(state.user.cognitoUser)
    && defined(state.user.cognitoUser.username) 
    && state.user.cognitoUser.username !== ''
  ) {
    update.username = state.user.cognitoUser.username;
  }

  return update
}

class ConnectedFooterBar extends Component {
  constructor(props) {
    super(props);

    this.LogOutButton = LogOutButton.bind(this)

    this.username = ''
  }
  
  render(){
    /*
    <Link className="App-link" to="/">
      Main
    </Link> | <Link className="App-link" to="/about">
      About
    </Link> | <Link className="App-link"  to={{
        pathname: 'documentation',
        state: {
          docsLocation: process.env.PUBLIC_URL + '/docs/build/html/index.html'
        }
      }}
    >
      Documentation
    </Link>
    */
    console.log("FooterBar this.props:")
    console.log(this.props)
    
    let usernameLabel = 'Not logged in'
    if(defined(this.props.username) && this.props.username !== '') {
      usernameLabel = `Logged in as ${this.props.username}`;
      console.log("FooterBar render usernameLabel:")
      console.log(usernameLabel)
    }

    return (
      <Row id="footer-bar" style={{minHeight:'60px'}}>
        <Col style={{ color:'lightgrey', maxWidth:'190px', paddingTop:'20px' }}>
          {SectionTitle(usernameLabel, '14px')}
        </Col>
        <Col style={{ width:'200px' }}>
          { this.LogOutButton() }
        </Col>
        <Col>
          <img 
            style={{
              position:'absolute',
              right:'15px',
              top:'-0px'
            }}
            id="bottom-right-logo"
            src={process.env.PUBLIC_URL + '/SmallLogoNew.png'} 
            alt="app icon"
          />
        </Col>
      </Row>
    )
  }
}

const FooterBar = connect(mapStateToProps)(withRouter(ConnectedFooterBar));

export default FooterBar;