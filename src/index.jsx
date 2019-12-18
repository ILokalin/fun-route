import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MapContainer from './components/MapContainer';
import HelpPage from './components/HelpPage';


ReactDOM.render((
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path='/' component={MapContainer} />
        <Route path='/help' component={HelpPage} />
      </Switch>
    </App>
  </BrowserRouter>
), document.getElementById('root'));


