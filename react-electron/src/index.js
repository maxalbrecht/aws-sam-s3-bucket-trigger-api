import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HashRouter as Router, Route } from 'react-router-dom'

import { Provider } from "react-redux";
import store from "./js/store/index";
import Home from "./App"
import About from "./pages/about"
import Documentation from "./pages/documentation"
import TitleBar from "./js/components/TitleBar"
import FooterBar from "./js/components/FooterBar"

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <main>
          <TitleBar />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />                
          <Route path="/documentation" component={Documentation} />
          <FooterBar />                
        </main>
      </div>
  </Router>
  </Provider>,
  document.getElementById("root")
    
)
