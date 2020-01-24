import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HashRouter as Router, Route } from 'react-router-dom'

import { Container } from 'react-bootstrap';

import { Provider } from "react-redux";
import theStore from "./js/store/index";
import App from "./js/components/app/App"
import About from "./pages/about"
import Documentation from "./pages/documentation"
import TitleBar from "./js/components/title_bar/TitleBar"
import FooterBar from "./js/components/footer_bar/FooterBar"

ReactDOM.render(
  <Provider store={theStore}>
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
