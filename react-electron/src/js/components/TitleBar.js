import React, { Component } from "react";
import './TitleBar.css';

class TitleBar extends Component {
  render(){
    return (
      <div id="title-bar">
        <img  id="small-icon" src={process.env.PUBLIC_URL + '/favicon.ico'} />
        <div id="app-title">The Syncer</div>
        <div id="title-bar-btns">
          {/* <button id="min-btn">-</button>
          <button id="max-btn">+</button>
          <button id="close-btn">x</button> */}
        </div>
      </div>
    )
  }
}

export default TitleBar