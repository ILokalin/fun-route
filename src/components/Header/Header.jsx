import React from 'react';
import { NavLink } from 'react-router-dom'


export default class extends React.Component {

  render () {
    
    return (
      <div className="header">
        <div className="header__up-line">
          <NavLink to="/" className="header__logo">FunRoute#</NavLink>
          <NavLink to="/help" className="header__help" >Help</NavLink>
        </div>
        <div className="header__decor-line"></div>
      </div>
      )
  }
}