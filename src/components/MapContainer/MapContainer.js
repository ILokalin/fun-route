import React, { Fragment } from 'react';
import Map from '../Map/Map';
import NewPoint from '../NewPoint/NewPoint';

export default class extends React.Component {
  constructor (props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);
    this.createPlacemark = this.createPlacemark.bind(this);
    this.onAddPoint = this.onAddPoint.bind(this);
  }

  state = {
    routePoints: [],
    currentPoint: {},
    ready: false
  }


  componentDidMount () {
    window.addEventListener ('load', this.handleLoad);
  }


  createPlacemark (createCoords = this.funMap.getCenter()) {
    const currentPoint = new window.ymaps.Placemark (
      createCoords,
      {},{
        preset: 'islands#icon',
        iconColor: '#16A085',
        draggable: true,
        cursor: 'pointer'
      }
    );

    this.setState(state => ({
            currentPoint: currentPoint,
            ready: true
          }));

    currentPoint.setCoord = (coords) => {
      const newPlacemark = Object.create(this.state.currentPoint);

      newPlacemark.geometry.setCoordinates(coords);

      window.ymaps.geocode(coords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressPointIcon = [
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(',').split(',').join(', ');

          const addressPointBalloon = firstGeoObject.getAddressLine();

          newPlacemark.properties
            .set({
              iconCaption: addressPointIcon,
              balloonContent: addressPointBalloon
            })
        })

      this.setState(state => ({
        currentPoint: newPlacemark
      }))
    };

    currentPoint.events.add('dragend', (event) => {
      const newCoords = event.originalEvent.target.geometry.getCoordinates();
      
      this.state.currentPoint.setCoord(newCoords);
    });

    this.funMap.geoObjects.add (
      currentPoint
    );
  }


  handleLoad () {
    const _this = this;

    window.ymaps.ready(() => {
      this.funMap = new window.ymaps.Map('map', {
        center: [55,35],
        zoom: 11
      }, {
        searchControlProvider: 'yandex#search'
      });

      this.createPlacemark();

      window.ymaps.geolocation.get({
        provider: 'auto',
        mapStateAutoApply: true
      })
        .then((result) => {
          _this.funMap.setZoom(5);

          return _this.funMap.panTo(
            result.geoObjects.position, {
              flying: true,
              duration: 1500
            }
          );
        })
        .then(() => {
          const newCoords = _this.funMap.getCenter();

          _this.funMap.setZoom(12);
          _this.state.currentPoint.setCoord(newCoords);
        })

        this.funMap.events.add('click', (event) => {
          const newCoords = event.getSourceEvent().originalEvent.coords;

          this.state.currentPoint.setCoord(newCoords);
        })

        this.funPolyline = new window.ymaps.Polyline(
          [],
          {}, {
            strokeColor: '#113040a0',
            strokeWidth: 4,
            editorMaxPoints: 0
          })
        
        this.funMap.geoObjects.add (
          this.funPolyline
          );

    })

  }

  generateUniqueKey (pre) {

    return `${ pre }_${ new Date().getTime() }`;
  };


  async getAddress (placemark) {
    const address = {};

    await window.ymaps.geocode(placemark.geometry.getCoordinates())
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressIconCaption = [
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(',').split(',').join(', ');

          const addressBalloonContent = firstGeoObject.getAddressLine();

          address.iconCaption = addressIconCaption;
          address.balloonContent =  addressBalloonContent;

        })

     return address;
  }



  async onAddPoint () {
    const coords = this.state.currentPoint.geometry.getCoordinates();
    const balloonContent = this.state.currentPoint.properties.get('balloonContent');
    const numOfPoint = this.state.routePoints.length;

    const newPoint = new window.ymaps.Placemark (
       coords,
      {
        balloonContent: balloonContent,
        iconContent: String.fromCharCode(numOfPoint + 65)
      },{
        preset: 'islands#icon',
        iconColor: '#34495E',
        draggable: true,
        cursor: 'pointer'
      });
    
    newPoint.id = this.generateUniqueKey(balloonContent);
    newPoint.geometry.num = numOfPoint;

    newPoint.geometry.events.add('change', (event) => {
      const newCoords = event.get('newCoordinates');

      this.funPolyline.geometry.set(event.originalEvent.target.num, newCoords);
    })

    newPoint.events.add('dragend', async (event) => {
      const pointOfEvent = event.originalEvent.target.geometry.num;
      const pointCoords = this.state.routePoints[pointOfEvent].geometry.getCoordinates();
      const tempPoint = Object.create(this.state.routePoints[pointOfEvent]);

      window.ymaps.geocode(pointCoords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          tempPoint.properties
            .set({
              balloonContent: firstGeoObject.getAddressLine()
            });
        })

      this.setState(
        state => ({
          routePoints: state.routePoints.slice(0, pointOfEvent ).concat(tempPoint).concat(state.routePoints.slice(pointOfEvent + 1))
        })
      );
    })

    this.funMap.geoObjects.add(newPoint);

    await this.setState(
      state => ({
        routePoints: [...state.routePoints, newPoint]
      })
    );

    // this.funMap.geoObjects.remove(this.state.currentPoint)
    
    // this.state.currentPoint.setCoord(this.funMap.getCenter());

    const pointsForLine = this.state.routePoints.map(point => point.geometry.getCoordinates());
    this.funPolyline.geometry.setCoordinates(pointsForLine);
  }


  render () {
    const currentCoords =  this.state.ready ? this.state.currentPoint.geometry.getCoordinates() : [0,0]

    return (
      <Fragment>
        <Map />
        <NewPoint
          currentCoords = { currentCoords }
          onAddPoint = { this.onAddPoint }
          />
      </Fragment>
      
    )

  }

}