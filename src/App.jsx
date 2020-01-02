import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MapContainer from 'components/MapContainer';
import HelpPage from 'components/HelpPage';
import ErrorPage from 'components/ErrorPage';


const INIT_MAP_ZOOM = 14,
      INIT_MAP_COORDINATE = [55.72, 37.64]

export default class extends React.Component {
  constructor () {
    super();

    this.onChangePage = this.onChangePage.bind(this);

    this.browserHistory = BrowserRouter.browserHistory;
  }


  state = {
    newSession: true,
    mapState: {
      isLocationFound: false,
      mapCenter: INIT_MAP_COORDINATE,
      mapZoom: INIT_MAP_ZOOM,
      routePointsArray: [],
      currentPointCoords: INIT_MAP_COORDINATE
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
      <BrowserRouter history={this.browserHistory}>
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
