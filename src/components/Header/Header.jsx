import React from 'react';


export default class extends React.Component {

  render () {
    
    return (
      <div className="header">
        <div className="header__up-line">
          <a className="header__logo" href="/">MyRoute#</a>
          <a className="header__help" href="/help">Help</a>
        </div>
        <div className="header__decor-line"></div>
      </div>
      )
  }
}