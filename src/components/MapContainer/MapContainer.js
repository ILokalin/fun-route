import React from 'react';
import Map from '../Map/Map';

export default class extends React.Component {
  constructor (props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount () {
    window.addEventListener ('load', this.handleLoad);
  }

  handleLoad () {
    window.ymaps.ready(() => {
      this.funMap = new window.ymaps.Map('map', {
        center: [55,35],
        zoom: 11
      }, {
        searchControlProvider: 'yandex#search'
      });
    })


  }

  render () {
    return <Map />
  }

}