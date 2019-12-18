import React, {Fragment} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';


function App({children}) {
  return (
    <Fragment>
      <div className="app">
        <header className="app__header">
          <Header />
        </header>
        <main className="app__main">
          {children}
        </main>
        <footer className="app__footer">
          <Footer />
        </footer>
      </div>    
    </Fragment>
  );
}

export default App;
