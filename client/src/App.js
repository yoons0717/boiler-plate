import React from 'react';

import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth'
// Routing 관련 일을 처리한다.
function App() {
  return (
    <Router>
      <div>
         
          <Switch>
            <Route exact path="/" component={Auth(LandingPage,null )}/>
          
            <Route exact path="/login" component={Auth(LoginPage,false)}/>
          
            <Route exact path="/register" component={Auth(RegisterPage, false)}/>
            
          </Switch>
      </div>
  </Router>
);
}



export default App;
