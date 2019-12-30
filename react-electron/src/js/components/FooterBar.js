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
      </div>
    )
  }
}

export default FooterBar;