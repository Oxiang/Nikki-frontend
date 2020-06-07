import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import $ from 'jquery';
// Import components
import LandingPage from "./components/landing-page.components"
import SignUpPage from "./components/signup-page.components"
import DiaryPage from "./components/diary-page.components"
import LoginPage from "./components/login-page.components"
import ViewPage from "./components/view-page.components"

function App() {
  return (
    <Router>
      <div>
        <ReactNotification />
        <Route path="/" exact component={LandingPage} />
        <Route path="/signUp" exact component={SignUpPage} />
        <Route path="/diary" exact component={DiaryPage} />
        <Route path='/login' exact component={LoginPage} />
        <Route path="/view" exact component={ViewPage}/>
      </div>
    </Router>
  );
}

export default App;
