import React, { Component } from 'react';
import { Router, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

import Login from './pages/login';
import Dashboard from './pages/dashboard';

class App extends Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route path='/dashboard' component = {Dashboard} />
            <Route path='/' exact component = {Login} />
          </div>
        </BrowserRouter>        
      </div>
    );
  }
}

export default App;
