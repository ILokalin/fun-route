import React from 'react';
import { NavLink } from 'react-router-dom'


export default class extends React.Component {

  render () {
    
    return (
      <div className="header">
        <nav className="header__up-line">
          <NavLink exact to="/" className="header__logo">FunRoute#</NavLink>
          <NavLink to="/help" className="header__menu-item" activeClassName="header__menu-item--active">Help</NavLink>
          <NavLink exact to="/" className="header__menu-item" activeClassName="header__menu-item--active">Карта</NavLink>
        </nav>
        <div className="header__decor-line"></div>
      </div>
      )
  }
}