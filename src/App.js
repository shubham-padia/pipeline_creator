import React, { Component } from 'react';
import { Home } from './components/Home';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Upload } from './components/Upload'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/upload" component={Upload} />
        </div>
      </Router>
    );
  }
}

export default App;
