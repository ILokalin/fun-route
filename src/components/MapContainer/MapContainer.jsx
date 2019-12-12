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
    this.howRouteShow = this.howRouteShow.bind(this);
    this.onAddPoint = this.onAddPoint.bind(this);
    this.onDeletePoint = this.onDeletePoint.bind(this);
    this.onChangeSequence = this.onChangeSequence.bind(this);
    this.onViewPoint = this.onViewPoint.bind(this);
    this.onChangeRoutType = this.onChangeRoutType.bind(this);
  }


  state = {
    routePoints: [],
    currentPoint: {},
    ready: false,
    routeType: 'polyline'
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
    
    newPoint.geometry.id = this.generateUniqueKey(balloonContent);
    newPoint.name = nameOfPoint;

    newPoint.geometry.events.add('change', (event) => {
      const newCoords = event.get('newCoordinates');
      const pointOfEvent = event.get('target');

      const index = this.state.routePoints.findIndex(point => point.geometry.id === pointOfEvent.id)
      this.funPolyline.geometry.set(index, newCoords);
    })

    newPoint.events.add('dragend', async (event) => {
      const pointOfEvent = event.originalEvent.target.geometry;
      const index = this.state.routePoints.findIndex(point => point.geometry.id === pointOfEvent.id)

      const pointCoords = this.state.routePoints[index].geometry.getCoordinates();
      const tempPoint = Object.create(this.state.routePoints[index]);

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
          routePoints: state.routePoints.slice(0, index ).concat(tempPoint).concat(state.routePoints.slice(index + 1))
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

    this.howRouteShow();
  }


  howRouteShow () {
    if (this.state.routeType === 'polyline') {
      const pointsForLine = this.state.routePoints.map(point => point.geometry.getCoordinates());

      this.funPolyline.geometry.setCoordinates(pointsForLine);
      this.funPolyline.options.set('visible', true);
      this.routeCollection.options.set('visible', true);

      this.multiRout && this.funMap.geoObjects.remove(this.multiRout);
      this.multiRout = null;

    } else {
      this.funPolyline.options.set('visible', false);
      this.routeCollection.options.set('visible', false);

      if (this.multiRout === 'undefined' || !this.multiRout)  {
          this.multiRout = new window.ymaps.multiRouter.MultiRoute({
            referencePoints: this.state.routePoints.map(point => point.geometry.getCoordinates()),
            params: {
              results: 2
            }
          }, {
            boundsAutoApply: true
          })
          this.funMap.geoObjects.add(this.multiRout);

        } else {
          this.multiRout.model.setReferencePoints(this.state.routePoints.map(point => point.geometry.getCoordinates()));

        }
      debugger
    }
  }


  async onDeletePoint (id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

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
        placemark.geometry.num = i;
        this.routeCollection.add(placemark);
      });

      this.howRouteShow();
    }
  }


  async onChangeSequence (newIndex, id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

    if (index > -1) {
      this.routeCollection.removeAll();

      if (newIndex > index) {
        await this.setState(
          state => ({
            routePoints: state.routePoints.slice(0, index).concat(state.routePoints.slice(index+1, newIndex+1)).concat(state.routePoints[index]).concat(state.routePoints.slice(newIndex+1))
          })
        )
      } else if (newIndex < index) {
        await this.setState(
          state => ({
            routePoints: state.routePoints.slice(0, newIndex).concat(state.routePoints[index]).concat(state.routePoints.slice(newIndex, index)).concat(state.routePoints.slice(index+1))
          })
        )
      }

      this.state.routePoints.forEach((placemark, i) => {
        placemark.properties
            .set({
              iconContent: i < 10 ? String.fromCharCode(i + 65) : ''
            });
        placemark.geometry.num = i;
        this.routeCollection.add(placemark);
      });

      this.howRouteShow();
    }
  }


  onViewPoint (id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

    this.funMap.panTo(
            this.state.routePoints[index].geometry.getCoordinates(), {
              flying: true,
            }
          );
  }


  async onChangeRoutType (routeState) {
    const {value} = routeState;
    const routeType = value ? 'multiRout' : 'polyline';

    await this.setState(
      state => ({
        routeType: routeType
      })
    )

    this.howRouteShow();
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
              routePoints   = { this.state.routePoints }
              onDeletePoint = { this.onDeletePoint }
              onViewPoint   = { this.onViewPoint }
              onChangeSequence = { this.onChangeSequence }
              />
          </div>

          <div className="main__type-button">
            <RouteTypeButton
              onChangeRoutType = { this.onChangeRoutType } 
              />
          </div>
        </main>

      </Fragment>
    )
  }
}