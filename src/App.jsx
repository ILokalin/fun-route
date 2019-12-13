import React, {Fragment} from 'react';
import MapContainer from './components/MapContainer/MapContainer';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <Fragment>
      <div className="app">
        <header className="app__header">
          <Header />
        </header>
        <main className="app__main">
          <MapContainer />
        </main>
        <footer className="app__footer">
          <Footer />
        </footer>
      </div>    
    </Fragment>
  );
}

export default App;
