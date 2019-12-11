import React, { Fragment } from 'react';
import Map from '../Map/Map';
import NewPoint from '../NewPoint/NewPoint';
import RouteContainer from '../RouteContainer/RouteContainer';
import RouteTypeButton from '../RouteTypeButton/RouteTypeButton';


export default class extends React.Component {
  constructor (props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);
    this.createPlacemark = this.createPlacemark.bind(this);
    this.onAddPoint = this.onAddPoint.bind(this);
    this.onDeletePoint = this.onDeletePoint.bind(this);
    this.loadPolyline = this.loadPolyline.bind(this);
  }


  state = {
    routePoints: [],
    currentPoint: {},
    ready: false
  }


  componentDidMount () {
    window.addEventListener ('load', this.handleLoad);
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

      this.currentPositionCollection = new window.ymaps.GeoObjectCollection();
      this.routeCollection = new window.ymaps.GeoObjectCollection();

      this.funMap.geoObjects.add(this.routeCollection);
      this.funMap.geoObjects.add(this.currentPositionCollection);

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

    currentPoint.setCoord = async (coords) => {
      const newPlacemark = Object.create(this.state.currentPoint);

      newPlacemark.geometry.setCoordinates(coords);

      await window.ymaps.geocode(coords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressPointIcon = [
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(',').split(',').join(', ');

          // const addressPointBalloon = firstGeoObject.getAddressLine();

          newPlacemark.properties
            .set({
              iconCaption: addressPointIcon,
              balloonContent: addressPointIcon
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

    currentPoint.setCoord(createCoords);
    this.currentPositionCollection.add(currentPoint);
  }

  
  generateUniqueKey (pre) {

    return `${ pre }_${ new Date().getTime() }`;
  };


  async onAddPoint (nameOfPoint) {
    const coords = this.state.currentPoint.geometry.getCoordinates();
    const balloonContent = this.state.currentPoint.properties.get('balloonContent');
    const numOfPoint = this.state.routePoints.length;

    const newPoint = new window.ymaps.Placemark (
       coords,
      {
        balloonContent: balloonContent,
        iconContent: numOfPoint < 10 ? String.fromCharCode(numOfPoint + 65) : ''
      },{
        preset: 'islands#icon',
        iconColor: '#34495E',
        draggable: true,
        cursor: 'pointer'
      });
    
    newPoint.id = this.generateUniqueKey(balloonContent);
    newPoint.geometry.num = numOfPoint;
    newPoint.name = nameOfPoint;

    newPoint.geometry.events.add('change', (event) => {
      const newCoords = event.get('newCoordinates');

      this.funPolyline.geometry.set(event.originalEvent.target.num, newCoords);
    })

    newPoint.events.add('dragend', async (event) => {
      const pointOfEvent = event.originalEvent.target.geometry.num;
      const pointCoords = this.state.routePoints[pointOfEvent].geometry.getCoordinates();
      const tempPoint = Object.create(this.state.routePoints[pointOfEvent]);

      await window.ymaps.geocode(pointCoords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressPointIcon = [
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(',').split(',').join(', ');

          tempPoint.properties
            .set({
              balloonContent: addressPointIcon
            });
        })

      this.setState(
        state => ({
          routePoints: state.routePoints.slice(0, pointOfEvent ).concat(tempPoint).concat(state.routePoints.slice(pointOfEvent + 1))
        })
      );
    })

    this.routeCollection.add(newPoint);

    await this.setState(
      state => ({
        routePoints: [...state.routePoints, newPoint]
      })
    );

    this.currentPositionCollection.remove(this.state.currentPoint);
    this.createPlacemark(coords);

    this.loadPolyline();
  }


  loadPolyline () {
    const pointsForLine = this.state.routePoints.map(point => point.geometry.getCoordinates());
    this.funPolyline.geometry.setCoordinates(pointsForLine);
  }


  async onDeletePoint (id) {
    const index = this.state.routePoints.findIndex(point => point.id === id)

    if (index > -1) {
      this.routeCollection.removeAll();

      await this.setState(
        state => ({
          routePoints: state.routePoints.slice(0, index).concat(state.routePoints.slice(index + 1))
        })
      )

      this.state.routePoints.forEach((placemark, i) => {
        placemark.properties
            .set({
              iconContent: i < 10 ? String.fromCharCode(i + 65) : ''
            });
        this.routeCollection.add(placemark);
      });
      this.loadPolyline();
    }

  }


  render () {
    let currentCoords = [0,0],
        currentAddress = 'Адрес не загружен';

    if (this.state.ready) {
      currentCoords =  this.state.currentPoint.geometry.getCoordinates();
      currentAddress = this.state.currentPoint.properties.get('balloonContent');
    }
    
    return (
      <Fragment>
        <main className="main">
          <div className="main__map">
            <Map />
          </div>

          <div className="main__new-point">
            <NewPoint
              currentCoords = { currentCoords }
              onAddPoint    = { this.onAddPoint }
              placemarkAddress = { currentAddress }
              />
          </div>

          <div className="main__route">
            <RouteContainer
              routePoints = { this.state.routePoints }
              onDeletePoint = { this.onDeletePoint }
              />
          </div>

          <div className="main__type-button">
            <RouteTypeButton />
          </div>
        </main>
        
        
        
      </Fragment>
      
    )

  }

}