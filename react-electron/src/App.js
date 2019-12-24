import React from 'react';
import { Link } from "react-router-dom"
import logo from './logo.svg';
import './App.css';

function NewTab() { 
  window.open( 
    "file:///C:/Users/devops2/Documents/GitHub/aws-sam-s3-bucket-trigger-api/react-electron/src/docs/build/html/index.html", "_blank"); 
} 

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <p>The Syncer App</p>
          <p>Companion desktop App that creates and delivers API request files to AWS S3 bucket</p>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Link className="App-link" to="/about">About Page</Link>
          <a
            className="App-link"
            href="https://maxalbrecht100aws-sam-s3-bucket-trigger-api.readthedocs.io/en/latest/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project Documentation
          </a>

        </header>
      </div>
  );
}

export default App;
