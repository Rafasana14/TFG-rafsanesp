//import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import OwnerList from './OwnerList';
import OwnerEdit from "./OwnerEdit";
import VetList from "./VetList";

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/api/v1/owners' exact={true} component={OwnerList}/>
            <Route path='/api/v1/owners/:id' component={OwnerEdit}/>
            <Route path='/api/v1/vets' exact={true} component={VetList}/>
          </Switch>
        </Router>
    )
  }
}

export default App;
