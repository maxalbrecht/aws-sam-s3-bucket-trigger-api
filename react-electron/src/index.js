import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HashRouter as Router, Route } from 'react-router-dom'

import { Container, Row, Col } from 'react-bootstrap';

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
        <Row className="titleBarRow">
          <TitleBar />
        </Row>
        <Row className="windowMainAreaRow">
            <Route exact path="/" component={App} />
            <Route path="/about" component={About} />                
            <Route path="/documentation" component={Documentation} />
        </Row>
        <Row className="footerBarRow">
          <Col>
            <FooterBar />
          </Col>
        </Row>                
      </Container>
  </Router>
  </Provider>,
  document.getElementById("root")
    
)
