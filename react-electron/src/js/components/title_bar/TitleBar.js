import React, { Component } from "react";
import './TitleBar.css';
import { Button } from 'react-bootstrap';
var electron = window.require("electron");
var remote = electron.remote;

const currentWindow = remote.getCurrentWindow()

class TitleBar extends Component {
  onMinimizeClicked(e) {
    currentWindow.minimize();
  }

  onMaximizeClicked(e) {
    if(currentWindow.isMaximized()){
      currentWindow.unmaximize();
    } else {
      currentWindow.maximize();
    }
  }

  onCloseClicked(e) {
    currentWindow.close();
  }

  render(){
    return (
      <div id="title-bar">
        <img  id="small-icon" src={process.env.PUBLIC_URL + '/favicon.ico'} alt="app icon"/>
        <div id="app-title">Verisync</div>
        <div id="title-bar-btns">
          <Button 
            variant="info" 
            id="min-btn" 
            className="title-bar-button" 
            onClick={this.onMinimizeClicked}
          >
            <span className="button-text">-</span>
          </Button>
          <Button 
            variant="info"
            id="max-btn"
            className="title-bar-button"
            onClick={this.onMaximizeClicked}
          >
            <span className="button-text">+</span>
          </Button>
          <Button
            variant="info"
            id="close-btn"
            className="title-bar-button title-bar-button-close"
            onClick={this.onCloseClicked}
          >
            <span className="button-text">x</span>
          </Button>
        </div>
      </div>
    )
  }
}

export default TitleBar