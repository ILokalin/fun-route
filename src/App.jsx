import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MapContainer from './components/MapContainer';
import HelpPage from './components/HelpPage';
import ErrorPage from './components/ErrorPage';

export default class extends React.Component {
  constructor () {
    super();

    this.onChangePage = this.onChangePage.bind(this);
  }

  state = {
    newSession: true,
    mapState: {
      isLocationFound: false,
      mapCenter: [55.72, 37.64],
      mapZoom: 14,
      routePointsArray: [],
      currentPointCoords: [55.72, 37.64]
    }
  }


  onChangePage (mapState) {
    this.setState(state => ({
      mapState: mapState,
      newSession: false
    }))
  }


  render () {
    return (
      <BrowserRouter>
        <div className="app">
          <header className="app__header">
            <Header />
          </header>
          <main className="app__main">
            <Switch>
              <Route exact path = '/' component = {() => <MapContainer
                                                          mapState = { this.state.mapState }
                                                          newSession = { this.state.newSession }
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