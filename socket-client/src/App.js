import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import PhotoPublisher from './components/photoPublisher';
import PhotoReceiver from './components/photoReceiver';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="app">
            <Switch>
                <Route path="/app/client1" component={PhotoPublisher}/>
                <Route path="/app/client2" component={PhotoReceiver}/>
            </Switch>
        </div>
    );
  }
}

export default App;
