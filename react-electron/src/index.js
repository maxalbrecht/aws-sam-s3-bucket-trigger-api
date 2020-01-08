import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HashRouter as Router, Route } from 'react-router-dom'

import { Container } from 'react-bootstrap';

import { Provider } from "react-redux";
import store from "./js/store/index";
import App from "./App"
import About from "./pages/about"
import Documentation from "./pages/documentation"
import TitleBar from "./js/components/TitleBar"
import FooterBar from "./js/components/FooterBar"

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Container xs={12} className="windowContainer">
        <TitleBar />
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />                
        <Route path="/documentation" component={Documentation} />
        <FooterBar />
      </Container>
  </Router>
  </Provider>,
  document.getElementById("root")
    
)
