import React from 'react';
import { Link } from "react-router-dom"
import logo from './logo.svg';
import './App.css';

function App() {
  //window.open('file:///C:\\Users\\devops2\\Documents\\GitHub\\aws-sam-s3-bucket-trigger-api\\docs\\build\\html\\index.html')

  return (
      <div className="App">
        <header className="App-header">
          <h2>The Syncer App</h2>
          <p>Companion desktop App that creates and delivers API request files to AWS S3 bucket</p>
          <img src={logo} className="App-logo" alt="logo" />

          <Link className="App-link" to="/about">About</Link>
          <Link className="App-link" to="/documentation">Documentation</Link>

        </header>
      </div>
  );
}

export default App;
