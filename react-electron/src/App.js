import React from 'react';
import { Link } from "react-router-dom"
import logo from './logo.svg';
import './App.css';

import List from "./js/components/List";
import Form from "./js/components/Form";
import TitleBar from './js/components/TitleBar';
import FooterBar from "./js/components/FooterBar";

function App() {
  return (
      <div className="App">
          <TitleBar />
          <body className="App-body">
            <div>
              <h5>Submitted Jobs</h5>
              <List />
            </div>
            <div>
              <h4>Submit a New Job</h4>
              <Form /> 
            </div>
            <br />
          </body>
          <FooterBar />
      </div>
  );
}

export default App;
