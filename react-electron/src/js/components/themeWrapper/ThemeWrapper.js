import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import { Route } from 'react-router-dom'
import { TOGGLE_DARK_THEME } from './../../constants/action-types'
import { THEME_DARK, THEME_LIGHT } from './../../constants/themes'
import { Container } from 'react-bootstrap'
import defined from './../../utils/defined'
import TitleBar from './../title_bar/TitleBar'
import FooterBar from './../footer_bar/FooterBar'
import Login from './../auth/login/Login'
import ChangePassword from './../auth/changePassword/ChangePassword'
import App from './../app/App'
import JobStatus from './../jobStatus/JobStatus'
import About from './../../../pages/about'
import Documentation from './../../../pages/documentation'
import ClearStateAction from './../../utils/clearStateAction'
import CheckUserActivity from './../../utils/checkUserActivity'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  console.log("Inside themewrapper mapStateToProps()...")
  console.log("themewrapper mapStateToProps() state:")
  console.log(state)

  let update = {}
  
  if(
    defined(state.action)
    && (state.action.type === TOGGLE_DARK_THEME)
  ) {
    console.log("Inside themeWrapper mapStateToProps() and state.action.type === TOGGLE_DARK_THEME")
    console.log("Toggling dark theme...")

    ClearStateAction(window.store);
    update.TriggerRender = uuidv4()
  }

  return update
}
class ConnectedThemeWrapper extends Component {
  constructor(props) {
    super(props);
    let { theStore } = props
    this.theStore = theStore
    CheckUserActivity(this);
  }
  getTheme() {
    let theme = THEME_DARK;

    if(defined(this.theStore.getState().theme) && this.theStore.getState().theme === THEME_LIGHT){ 
      console.log(this.theStore.getState());
      theme=this.theStore.getState().theme;
    }

    return theme;
  }

  render(){
    console.log('rendering ThemeWrapper...')
    let className = this.getTheme();
    console.log('themeWrapper.render.className:')
    console.log(className)
    return (
      <div id = "themeWrapper" 
        className = { className + ' ' + className } 
        style={{height:'100%'}}
      >
      <Container xs={12} className="windowContainer" >
        <TitleBar />
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/changepassword" component={ChangePassword} />
        <Route path="/register" component={Login} />
        <Route exact path="/app" component={App} />
        <Route path="/about" component={About} />                
        <Route path="/documentation" component={Documentation} />
        <Route path="/jobstatus" component={JobStatus} />
        <Route path="/drc" component={Login} />
        <FooterBar />
      </Container>
      </div>
    )
  }
}

const ThemeWrapper = connect(mapStateToProps)(withRouter(ConnectedThemeWrapper));

export default ThemeWrapper;