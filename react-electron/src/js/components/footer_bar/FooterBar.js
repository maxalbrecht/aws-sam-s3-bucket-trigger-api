import React, { Component } from "react";
import { Link } from "react-router-dom"
import './FooterBar.css'

class FooterBar extends Component {
  render(){
    return (
      <div id="footer-bar">
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
        <img 
          style={{
            position:'absolute',
            right:'15px',
            top:'-10px'
          }}
          id="bottom-right-logo"
          src={process.env.PUBLIC_URL + '/SmallLogoNew.png'} 
          alt="app icon"
        />
      </div>
    )
  }
}

export default FooterBar;