import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import { Col, Row } from 'react-bootstrap'
import LogOutButton from './logOutButton'
import ToggleDarkThemeSlider from './toggleDarkThemeSlider'
import defined from '../../utils/defined'
import SectionTitle from './../../utils/sectionTitle'
import { THEME_LIGHT } from './../../constants/themes'

function mapStateToProps(state, ownProps) {
  let update = {}

  if(
    defined(state.user)
    && defined(state.user.cognitoUser)
    && defined(state.user.cognitoUser.username) 
    && state.user.cognitoUser.username !== ''
  ) {
    update.username = state.user.cognitoUser.username
  }

  if(defined(state.theme)) {
    update.theme = state.theme
  }

  return update
}

class ConnectedFooterBar extends Component {
  constructor(props) {
    super(props)

    this.LogOutButton = LogOutButton.bind(this)
    this.ToggleDarkThemeSlider = ToggleDarkThemeSlider.bind(this)

    if(!defined(this.username)) {
      this.username = ''
    }

    if(!defined(this.theme)) {
      this.theme = ''
    }
  }
  
  render(){
    //^^//console.log("FooterBar this.props:")
    //^^//console.log(this.props)
    
    let usernameLabel = 'Not logged in'
    if(defined(this.props.username) && this.props.username !== '') {
      usernameLabel = `Logged in as ${this.props.username}`;
      //^^//console.log("FooterBar render usernameLabel:")
      //^^//console.log(usernameLabel)
    }

    let logo = '/SmallLogoNew.png'

    if(defined(this.props.theme) && this.props.theme === THEME_LIGHT) {
      logo = '/SmallLogoNewLight.png'
    }

    return (
      <Row id="footer-bar" style={{minHeight:'60px', transition:'all 0.25s ease'}}>
        <Col
          className="footerUsernameLabel"
          style={{ width:'190px', maxWidth:'190px', paddingTop:'20px' }}
        >
          {SectionTitle(usernameLabel, '14px')}
        </Col>
        <Col 
          className="footerLogoutButton"
          style={{ width:'200px', maxWidth:'200px' }}
        >
          { this.LogOutButton() }
        </Col>
        <Col 
          style={{ paddingTop:'20px', paddingRight:'50px', width:'auto'}}
        >
          { this.ToggleDarkThemeSlider() }
        </Col>
        <Col style= {{ width:'200px', maxWidth:'200px' }}>
          <img 
            style={{
              position:'absolute',
              right:'15px',
              top:'-0px'
            }}
            id="bottom-right-logo"
            src={process.env.PUBLIC_URL + logo} 
            alt="app icon"
          />
        </Col>
      </Row>
    )
  }
}

const FooterBar = connect(mapStateToProps)(withRouter(ConnectedFooterBar));

export default FooterBar;