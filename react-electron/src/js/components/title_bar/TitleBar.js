import React, { Component } from "react"
import { withRouter } from 'react-router-dom'
import './TitleBar.scss'
import Logging from './../../utils/logging'
import { Button, Row, Col } from 'react-bootstrap'
import NavDropdown from './../navDropdown/NavDropdown'
var electron = window.require("electron")
var remote = electron.remote

const currentWindow = remote.getCurrentWindow()

class WithRouterTitleBar extends Component {
  constructor(props) {
    super(props)

    this.NavDropdown = NavDropdown.bind(this)
  }
  onMinimizeClicked(e) {
    currentWindow.minimize()
  }

  onMaximizeClicked(e) {
    if(currentWindow.isMaximized()){
      currentWindow.unmaximize()
    } else {
      currentWindow.maximize()
    }
  }

  onCloseClicked(e) {
    currentWindow.close()
  }

  render(){
    return (
      <Row id="title-bar" >
        <img  id="small-icon" src={process.env.PUBLIC_URL + '/favicon.ico'} alt="app icon"/>
        <Col style={{width:'20px', maxWidth:'100px'}}>
          <div id="app-title">VeriSuite</div>
        </Col>
        <Col >
          <div style={{paddingTop:'5px'}}>v {process.env.REACT_APP_VERSION}</div>
        </Col>
          { this.NavDropdown() }
        <div id="title-bar-btns" style={{transition:'background-color 0.25s ease'}}>
          <Button 
            variant="info" 
            id="min-btn" 
            className="title-bar-button" 
            onClick={this.onMinimizeClicked}
            style={{transition:'background-color 0.25s ease'}}
          >
            <span className="button-text">-</span>
          </Button>
          <Button 
            variant="info"
            id="max-btn"
            className="title-bar-button"
            onClick={this.onMaximizeClicked}
            style={{transition:'background-color 0.25s ease'}}
          >
            <span className="button-text">+</span>
          </Button>
          <Button
            variant="info"
            id="close-btn"
            className="title-bar-button title-bar-button-close"
            onClick={this.onCloseClicked}
            style={{transition:'all 0.25s ease'}}
          >
            <span className="button-text">x</span>
          </Button>
        </div>
      </Row>
    )
  }
}

const TitleBar = withRouter(WithRouterTitleBar)
export default TitleBar