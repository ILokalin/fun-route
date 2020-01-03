import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MapContainer from 'components/MapContainer';
import HelpPage from 'components/HelpPage';
import ErrorPage from 'components/ErrorPage';


export default class extends React.Component {
  constructor () {
    super();

 
    this.onChangePage = this.onChangePage.bind(this);
    this.browserHistory = BrowserRouter.browserHistory;
  }


  onChangePage (mapState) {
    this.mapState = Object.create(mapState);
    this.newSession = false;
  }


  render () {
    return (
      <BrowserRouter history={this.browserHistory}>
        <div className="app">
          <header className="app__header">
            <Header />
          </header>
          <main className="app__main">
            <Switch>
              <Route exact path = '/' component = {() => <MapContainer
                                                          mapState = { this.mapState }
                                                          newSession = { this.newSession }
                                                          onChangePage = { this.onChangePage }
                                                          />} 
                                                          />
              <Route path = '/help' component = { HelpPage } />
              <ErrorPage path="*" />
            </Switch>
          </main>
          <footer className="app__footer">
            <Footer />
          </footer>
        </div>    
      </BrowserRouter>
    );
  }
}
