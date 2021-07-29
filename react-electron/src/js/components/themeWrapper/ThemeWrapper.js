import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import { Route } from 'react-router-dom'
import { THEME_DARK, THEME_LIGHT } from './../../constants/themes'
import { Container } from 'react-bootstrap'
import defined from './../../utils/defined'
import TitleBar from './../title_bar/TitleBar'
import FooterBar from './../footer_bar/FooterBar'
import Login from './../auth/login/Login'
import ChangePassword from './../auth/changePassword/ChangePassword'
import App from './../app/App'
import JobStatus from './../jobStatus/JobStatus'
import JobArchiving from './../jobArchiving/JobArchiving'
import MpegConversion from './../mpegConversion/MpegConversion'
import LocalDownload from './../localDownload/LocalDownload'
import FileStitching from './../fileStitching/FileStitching'
import About from './../../../pages/about'
import Documentation from './../../../pages/documentation'
import CheckUserActivity from './../../utils/checkUserActivity'
import mapStateToProps from './mapStateToProps'

class ConnectedThemeWrapper extends Component {
  constructor(props) {
    super(props);
    this.theStore = props.theStore
    CheckUserActivity(this);
  }

  getTheme() {
    let theme = THEME_DARK;
    let storeState

    if(defined(this, "theStore")) { storeState = this.theStore.getState() }

    if(defined(storeState, "theme") && storeState.theme === THEME_LIGHT){ 
      theme = storeState.theme;
    }

    return theme;
  }

  render(){
    let className = this.getTheme()

    return (
      <div id = "themeWrapper" 
        className = { className } 
        style={{height:'100%'}}
      >
      <Container xs={12} className="windowContainer" >
        <TitleBar />
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/changepassword" component={ChangePassword} />
        <Route path="/register" component={Login} />
        <Route path="/about" component={About} />                
        <Route path="/documentation" component={Documentation} />
        <Route path="/jobstatus" component={JobStatus} />
        <Route exact path="/app" component={App} />
        <Route path="/jobarchiving" component={JobArchiving} />
        <Route path="/filestitching" component={FileStitching} />
        <Route path="/filestitchingqa" component={FileStitching} />
        <Route path="/mpegconversion" component={MpegConversion} />
        <Route path="/localdownload" component={LocalDownload} />
        <Route path="/drc" component={Login} />
        <FooterBar />
      </Container>
      </div>
    )
  }
}

const ThemeWrapper = connect(mapStateToProps)(withRouter(ConnectedThemeWrapper));

export default ThemeWrapper;