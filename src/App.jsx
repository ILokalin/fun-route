import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MapContainer from './components/MapContainer';
import HelpPage from './components/HelpPage';
import ErrorPage from './components/ErrorPage';

export default class extends React.Component {
  constructor (props) {
    super(props);

    this.onChangePage = this.onChangePage.bind(this);
  }

  state = {
    
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
              <Route path = '/' component = {() => <MapContainer
                                                      mapState = { this.state.mapState }
                                                      newSession = { this.state.newSession }
                                                      onChangePage = { this.onChangePage }
                                                      /> } exact />
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