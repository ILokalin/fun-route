import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


export default class extends React.Component {

  static propTypes = {
  isLocationFound: PropTypes.bool.isRequired
  }

  render () {
    const { isLocationFound } = this.props

    return (
      <div className="map-region">
        {!isLocationFound 
          ? <Fragment>
              <div className="map-region__map map-region__map--hidden" id="map"></div>
              <span className="map-region__preloader">
                <div className="object" id="object_one"></div>
                <div className="object" id="object_two"></div>
                <div className="object" id="object_three"></div>
                <div className="object" id="object_four"></div>
              </span>
            </Fragment>
          : <div className="map-region__map" id="map"></div>
          } 
      </div>
    )
  }
}