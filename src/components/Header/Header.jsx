import React from 'react';
import { Link } from 'react-router-dom'


export default class extends React.Component {

  render () {
    
    return (
      <div className="header">
        <nav className="header__up-line">
          <Link exact to="/" className="header__logo">FunRoute#</Link>
          <Link to="/help" className="header__help" >Help</Link>
        </nav>
        <div className="header__decor-line"></div>
      </div>
      )
  }
}