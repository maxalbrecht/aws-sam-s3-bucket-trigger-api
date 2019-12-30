import React, { Component } from "react";
import './TitleBar.css';
import { Button } from 'react-bootstrap';

class TitleBar extends Component {
  onMinimizeClicked(e) {
    console.log("trying to minimize the window!");
  }

  render(){
    return (
      <div id="title-bar">
        <img  id="small-icon" src={process.env.PUBLIC_URL + '/favicon.ico'} alt="app icon"/>
        <div id="app-title">The Syncer</div>
        <div id="title-bar-btns">
          <Button 
            variant="info" 
            id="min-btn" 
            className="title-bar-button" 
            onClick={this.onMinimizeClicked}
          >
            <span className="button-text">-</span>
          </Button>
          <Button variant="info" id="max-btn" className="title-bar-button">
            <span className="button-text">+</span>
          </Button>
          <Button variant="info" id="close-btn" className="title-bar-button title-bar-button-close">
          <span className="button-text">x</span>
          </Button>
        </div>
      </div>
    )
  }
}

export default TitleBar