import React, { Component } from "react";
import { Link } from "react-router-dom"
import './FooterBar.css'

class FooterBar extends Component {
  render(){
    return (
      <div id="footer-bar">
        <Link className="App-link" to="/about">
          About
        </Link> | <Link className="App-link" to="/documentation">
          Documentation
        </Link>
      </div>
    )
  }
}

export default FooterBar;