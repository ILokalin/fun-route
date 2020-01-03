import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/Map';
import NewPoint from 'components/NewPoint';
import RouteContainer from 'components/RouteContainer';
import RouteTypeButton from 'components/RouteTypeButton';



const ACTIVE_ELEMENT_COLOR = '#16A085',
      LIGHT_ELEMENT_COLOR = '#798995',
      ITEM_BG_COLOR = '#34495E',
      INIT_MAP_ZOOM = 14,
      INIT_MAP_COORDINATE = [55.72, 37.64],
      YANDEX_MAP_ID = 'map',
      SEARCH_PROVIDER   = { YANDEX: 'yandex#search' },
      LOCATION_PROVIDER = { YANDEX: 'yandex' },
      ROUTE_TYPE = {
        POLYLINE: 'polyline',
        MULTIROUTE: 'multiRoute'
        };


export default class extends React.Component {

  static propTypes = {
    newSession: PropTypes.bool.isRequired,
    mapState:   PropTypes.shape({
      isLocationFound:  PropTypes.bool.isRequired,
      mapCenter:        PropTypes.arrayOf(PropTypes.number).isRequired,
      mapZoom:          PropTypes.number.isRequired,
      routPointsArray:  PropTypes.array,
      currentPointCoords: PropTypes.array.isRequired
    }),
    onChangePage:     PropTypes.func.isRequired
  };

  static defaultProps = {
    newSession: true,
    mapState: {
      isLocationFound: false,
      mapCenter: INIT_MAP_COORDINATE,
      mapZoom: INIT_MAP_ZOOM,
      routePointsArray: [],
      currentPointCoords: INIT_MAP_COORDINATE
    },
    onChangePage: () => false
  };

    state = {
    routePoints: [],
    currentPoint: {},
    isLocationFound: false,
    routeType: 'polyline'
  };


  constructor (props) {
    super(props);
    
    this.onAddPoint = this.onAddPoint.bind(this);
    this.onDeletePoint = this.onDeletePoint.bind(this);
    this.onChangeSequence = this.onChangeSequence.bind(this);
    this.onViewPoint = this.onViewPoint.bind(this);
    this.onChangeRoutType = this.onChangeRoutType.bind(this);
  }


  componentDidMount () {
    const { newSession } = this.props

    if (newSession) {
      window.addEventListener ('load', this.handleLoad());
    } else {
      this.handleLoad()
    }
  }


  /**
   * При смене страницы на /help, необходима сохранить все данные о текущем состоянии карты.
   * Сохраняеются:
   * - mapCenter - {array} -координаты центральной точки
   * - mapZoom - {number} - установленный пользователем zoom
   * - currentPointCoords - {array} - координаты основного маркера
   * - routePointsArray - {array} - массив с координатами точек, их именами и адресами
   * - routeType - {string} - режим отображения маршрута
   */
  componentWillUnmount () {
    const { currentPoint, routePoints, isLocationFound, routeType } = this.state;

    const currentPointCoords = currentPoint.geometry.getCoordinates(),
          mapZoom = this.funMap.getZoom(),
          mapCenter = this.funMap.getCenter(),
          routePointsArray = routePoints.map(point => ({
              coords: point.geometry.getCoordinates(),
              name: point.name,
              address: point.properties.get('balloonContent')
              }));

    this.props.onChangePage({
      mapCenter: mapCenter,
      mapZoom: mapZoom,
      currentPointCoords: currentPointCoords,
      routePointsArray: routePointsArray,
      isLocationFound: isLocationFound,
      routeType: routeType
    });
  }


  /**
   * Инициализация яндекс-карты после полной ее загрузки
   * Чтение геолокации и позиционирование карты
   * Создание коллекция для меток:
   * routeCollection - для меток маршрута;
   * currentPositionCollection - для текущей метки;
   * @function
   * @name handleLoad
   */
  handleLoad () {
    const { newSession, mapState} = this.props;
    const _this = this;

    window.ymaps.ready(() => {
      this.funMap = new window.ymaps.Map(YANDEX_MAP_ID, {
        center: mapState.mapCenter,
        zoom: mapState.mapZoom
      }, {
        searchControlProvider: SEARCH_PROVIDER.YANDEX
      });

      // Коллекции для раздельного управления маркерами на карте
      this.currentPositionCollection = new window.ymaps.GeoObjectCollection();
      this.routeCollection = new window.ymaps.GeoObjectCollection();

      this.funMap.geoObjects.add(this.routeCollection);
      this.funMap.geoObjects.add(this.currentPositionCollection);
      
      this.createFunBalloonLayout();
      this.createPlacemark(mapState.currentPointCoords);

      /**
         * Promise определения местоположения от ymaps
         * Время ожидания 2000мс
         * Провайдер "Яндекс":
         * - не требует от пользователя разрешение определить местоположение
         * - не смотря на короткий таймаут работает на мобильных устройствах
         * - не отличатеся точностью - указывает местоположение провайдера
         */
      if (newSession || !mapState.isLocationFound) {
        window.ymaps.geolocation.get({
          provider: LOCATION_PROVIDER.YANDEX,
          mapStateAutoApply: true,
          timeout: 2000
          })
          .then((result) => {
            _this.funMap.setZoom(14);

            return _this.funMap.panTo(
              result.geoObjects.position, {}
            );
          })
          .then(() => {
            const newCoords = _this.funMap.getCenter();

            _this.state.currentPoint.setCoord(newCoords);

            _this.setState({
              isLocationFound: true
            })
          })
      } else {
        this.setState(
          state => ({
            isLocationFound: mapState.isLocationFound,
            routeType: mapState.routeType
          })
        )
      }

      this.funMap.events.add('click', (event) => {
        const newCoords = event.getSourceEvent().originalEvent.coords;

        this.state.currentPoint.setCoord(newCoords);
      })

      this.funPolyline = new window.ymaps.Polyline(
        [],
        {}, {
          strokeColor: [LIGHT_ELEMENT_COLOR,ACTIVE_ELEMENT_COLOR],
          strokeWidth: [6,4],
          editorMaxPoints: 0
        })
      
      this.funMap.geoObjects.add (
        this.funPolyline
        );

      if (!newSession) {
        mapState.routePointsArray.forEach(point => {
          this.handleAddPoint(point);
        })
      }
    })
  }


  createFunBalloonLayout () {
    this.MyBalloonLayout = window.ymaps.templateLayoutFactory.createClass(
        '<div class="popover top styledPlacemark">' +
          '<a class="popover__close" href="#">&times;</a>' +
          '<div class="popover__arrow arrow"></div>' +
          '<div class="popover__inner">' +
            '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
          '</div>' +
        '</div>', {

        /**
         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
         * @function
         * @name build
         */
        build: function () {
          this.constructor.superclass.build.call(this);

          this._element = document.querySelector('.popover');
          this.applyElementOffset();

          this._element.querySelector('.popover__close').addEventListener('click', this.onCloseClick.bind(this))
        },

        /**
         * Удаляет содержимое макета из DOM.
         * @function
         * @name clear
         */
        clear: function () {
          this._element.querySelector('.popover__close').removeEventListener('click', this.onCloseClick.bind(this))

          this.constructor.superclass.clear.call(this);
        },

        /**
         * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
         * @function
         * @name onSublayoutSizeChange
         */
        onSublayoutSizeChange: function () {
          this.constructor.superclass.onSublayoutSizeChange.apply(this, arguments);

          if (!this._isElement(this._element)) {
              return;
          }

          this.applyElementOffset()
          this.events.fire('shapechange');
        },
          
        /**
         * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
         * @function
         * @name applyElementOffset
         */
        applyElementOffset: function () {
            this._element.style.left = `${-(this._element.offsetWidth / 2)}px`;
            this._element.style.top = `${-(this._element.offsetHeight + this._element.querySelector('.popover__arrow').offsetHeight - 5)}px`;

        },

        onCloseClick: function (event) {
          event.preventDefault();

          this.events.fire('userclose');
        },

        /**
         * Используется для автопозиционирования (balloonAutoPan).
         * @function
         * @name getClientBounds
         * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
         */
        getShape: function () {
          if(!this._isElement(this._element)) {
              return this.constructor.superclass.getShape.call(this);
          }

          const position = {
            top: parseInt(this._element.style.top),
            left: parseInt(this._element.style.top)
          }
            

          return new window.ymaps.shape.Rectangle(new window.ymaps.geometry.pixel.Rectangle([
              [position.left, position.top], [
                  position.left + this._element.offsetWidth,
                  position.top + this._element.offsetHeight + this._element.querySelector('.popover__arrow').offsetHeight
              ]
          ]));
        },

        _isElement: function (element) {
                  return element && element.querySelector('.popover__arrow');
        }
        }
      );

    this.MyBalloonContentLayout = window.ymaps.templateLayoutFactory.createClass(
      '<h3 class="popover__title">$[properties.balloonHeader]</h3>' +
      '<div class="popover__content">$[properties.balloonContent]</div>'
      );
  }
  

  /**
   * Саздание текущей метки для выделения точки на карте
   * @function
   * @name createPlacemark
   * @param {array} [lat,long] координаты точки (ширина, долгота)
   */
  createPlacemark (createCoords = this.funMap.getCenter()) {
    const currentPoint = new window.ymaps.Placemark (
      createCoords,
      {
        balloonHeader: 'Расположение'
      },{
        preset: 'islands#icon',
        iconColor: ACTIVE_ELEMENT_COLOR,
        draggable: true,
        cursor: 'pointer',
        zIndex: 1000,

        balloonShadow: false,
        balloonLayout: this.MyBalloonLayout,
        balloonContentLayout: this.MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0
      }
    );

    this.setState({
      currentPoint: currentPoint
      });

    /**
     * Метод для установки новых координат и изменения состояния маркера
     * @function
     * @name setCoord
     * @param [lat,long] координаты точки (ширина, долгота)
     */
    currentPoint.setCoord = async (coords) => {
      const newPlacemark = Object.create(this.state.currentPoint);

      newPlacemark.geometry.setCoordinates(coords);

      /**
       * Адрес необходимо загрузить в метку до изменения метки в state
       * Смена адреса и координат инициируют ренедер модуля NewPoint
       * Ожидание загрузки адреса
       */
      await window.ymaps.geocode(coords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressPointIcon = [
            firstGeoObject.getLocalities().length 
              ? firstGeoObject.getLocalities() 
              : firstGeoObject.getAdministrativeAreas().length 
                ? firstGeoObject.getAdministrativeAreas() 
                : firstGeoObject.getCountry(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(', ');

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

  
  /**
   * Генерация уникального ключа на основании текущего времени и адреса метки
   * @function
   * @name generateUniqueKey
   * @params {string} pre - адрес метки
   * @return {string} уникальный ключ
   */
  generateUniqueKey (pre) {

    return `${ pre }_${ new Date().getTime() }`;
  };


  /**
   * Подготовка для добавления точки в маршрут. Создает объект с координатами точки
   * именем и адресом из текущей точки.
   * @function
   * @name onAddPoint
   * @params {string} nameOfPoint - название точки точки
   */
  onAddPoint (nameOfPoint) {
    const balloonContent = this.state.currentPoint.properties.get('balloonContent'),
          coords = this.state.currentPoint.geometry.getCoordinates();

    this.handleAddPoint({
      address: balloonContent,
      name: nameOfPoint,
      coords: coords
    })
  }

  /**
   * Добавление точки в маршрут
   * Точка добавляется в массив:    this.state.routePoints
   * Точка добавляется в коллекцию: this.routeCollection
   * @function
   * @name handleAddPoint
   * @params {object} point - объект с полной информацией для новой точки
   * point.address - {string} - адрес точки
   * point.name - {string} - имя для точки
   * point.coords - {array} - массив координат
   */
  async handleAddPoint (point) {
    const { coords, address, name } = point

    const numOfPoint = this.state.routePoints.length;

    const newPoint = new window.ymaps.Placemark (
       coords,
      {
        balloonHeader: 'Расположение',
        balloonContent: address,
        iconContent: numOfPoint < 26 ? String.fromCharCode(numOfPoint + 65) : '',
      },{
        preset: 'islands#circleIcon',
        iconColor: ITEM_BG_COLOR,
        draggable: true,
        cursor: 'pointer',
        hideIconOnBalloonOpen: false,

        balloonShadow: false,
        balloonLayout: this.MyBalloonLayout,
        balloonContentLayout: this.MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0
      });

    newPoint.geometry.id = this.generateUniqueKey(address);
    newPoint.name = name;

    /**
     * Смена координат (перенос метки на карте) вызывает смену координат в ломаной
     * индекс метки читается для определеня порядкового номера точки в маршруте
     * Во время перемещения точки нет необходимости изменять state
     */
    newPoint.geometry.events.add('change', (event) => {
      const newCoords = event.get('newCoordinates');
      const pointOfEvent = event.get('target');

      const index = this.state.routePoints.findIndex(point => point.geometry.id === pointOfEvent.id)
      this.funPolyline.geometry.set(index, newCoords);
    })

    /**
     * По окончанию перемещения точки необходимо получить новый адрес
     * Необходимо зафиксировать изменение state для routePoints
     * Изменения вызывают замену соответствующего пункта RouteContainer -> RoutePoint
     */
    newPoint.events.add('dragend', async (event) => {
      const pointOfEvent = event.originalEvent.target.geometry;
      const index = this.state.routePoints.findIndex(point => point.geometry.id === pointOfEvent.id)

      const pointCoords = this.state.routePoints[index].geometry.getCoordinates();
      const tempPoint = Object.create(this.state.routePoints[index]);

      /**
       * Адрес необходимо загрузить в метку до изменения метки в state
       * Ожидание загрузки адреса
       */
      await window.ymaps.geocode(pointCoords)
        .then (function (res) {
          const firstGeoObject = res.geoObjects.get(0);

          const addressPointIcon = [
            firstGeoObject.getLocalities().length 
              ? firstGeoObject.getLocalities() 
              : firstGeoObject.getAdministrativeAreas().length 
                ? firstGeoObject.getAdministrativeAreas() 
                : firstGeoObject.getCountry(),
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

    /**
     * Необходимо дождаться выполнения записи новой точки в this.state.routePoints
     * Чтобы при загрузке маршрута ее координаты были в наличии
     */
    await this.setState(
      state => ({
        routePoints: [...state.routePoints, newPoint]
      })
    );

    this.howRouteShow();
  }


  /**
   * Как показать маршрут - ломаная линия или мультимаршурт для движения
   * Читает this.routeType ('polyline' || 'multiRoute')
   * При показе мультимаршрута у ломаной убирается видимость и линия не удаляется с карты
   * Так же, скрывается коллекция меток - у мультимаршурта создаются свои метки
   * При показе ломаной линии, мультимаршурт удаляеться с карты
   * @function
   * @name howRouteShow
   */
  howRouteShow () {
    if (this.state.routeType === ROUTE_TYPE.POLYLINE) {
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
    }
  }


  /**
   * Удаление точки из маршрута.
   * Удаление просиходит через полную очистку коллекции this.routeCollection
   * и загрузку оставшихся меток. После этого вызывается howRouteShow для перезагрузки видимой части маршрута
   * @function
   * @name onDeletePoint
   * @params {string} id - уникальный идентификатор метки в маршруте
   */
  async onDeletePoint (id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

    if (index > -1) {
      this.routeCollection.removeAll();

      const newRoute = this.state.routePoints.slice(0, index).concat(this.state.routePoints.slice(index + 1));

      newRoute.forEach((placemark, numOfPoint) => {
        placemark.properties
            .set({
              iconContent: numOfPoint < 26 ? String.fromCharCode(numOfPoint + 65) : ''
            });
        placemark.geometry.num = numOfPoint;
        this.routeCollection.add(placemark);
      });

      // Необходимо дождаться записи state.routePoints перед показом маршрута
      await this.setState(
        state => ({
          routePoints: newRoute
        })
      )

      this.howRouteShow();
    }
  }


  /**
   * Изменение позиции в маршруте у метки с указанным id
   * Вызывается как при перетаскивании элементов, так и нажатии кнопок "вверх"/"вниз"
   * Старое местоположение определяется уникальным id, новое передается функционалом события из RouteContainer
   * @function
   * @name onChangeSequence
   * @params {number} newIndex - новое положение в маршруте
   * @params {string} id - уникальный идентификатор элемента
   */
  async onChangeSequence (newIndex, id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

    if (index > -1 && index !== newIndex) {
      let newRoute = [];
      this.routeCollection.removeAll();
      
      if (newIndex > index) {
        newRoute = this.state.routePoints.slice(0, index).concat(this.state.routePoints.slice(index+1, newIndex+1)).concat(this.state.routePoints[index]).concat(this.state.routePoints.slice(newIndex+1))

      } else if (newIndex < index) {
        newRoute = this.state.routePoints.slice(0, newIndex).concat(this.state.routePoints[index]).concat(this.state.routePoints.slice(newIndex, index)).concat(this.state.routePoints.slice(index+1))

      }

      newRoute.forEach((placemark, numOfPoint) => {
        placemark.properties
            .set({
              iconContent: numOfPoint < 26 ? String.fromCharCode(numOfPoint + 65) : ''
            });
        placemark.geometry.num = numOfPoint;
        this.routeCollection.add(placemark);
      });

      await this.setState(
          state => ({
            routePoints: newRoute
          })
        )

      this.howRouteShow();
    }
  }


  /**
   * Плавное смещение центра карты на указанную точку по id
   * @function
   * @name onViewPoint
   * @params {string} id - уникальный идентификатор метки
   */
  onViewPoint (id) {
    const index = this.state.routePoints.findIndex(point => point.geometry.id === id);

    this.funMap.panTo(
            this.state.routePoints[ index ].geometry.getCoordinates(), {
              flying: true,
            }
          );
  }


  /**
   * Изменение отображения маршрута. Событие от RouteTypeButton
   * Маршрут может быть представлен в виде ломаной линии (polyline) или мультимаршрута (multiRoute)
   * @function
   * @name onChangeRoutType
   * @params {boolean} routeState - состояние переключателя маршрута
   */
  async onChangeRoutType (routeState) {
    const routeType = routeState ? ROUTE_TYPE.MULTIROUTE : ROUTE_TYPE.POLYLINE;

    await this.setState({
      routeType: routeType
    })

    this.howRouteShow();
  }

  
  render () {
    let currentCoords,
        currentAddress;

    if (this.state.isLocationFound) {
      currentCoords =  this.state.currentPoint.geometry.getCoordinates();
      currentAddress = this.state.currentPoint.properties.get('balloonContent');
    }

    return (
      <Fragment>
        <div className="main">
          <div className="main__map">
            <Map 
              isLocationFound = { this.state.isLocationFound }
              />
          </div>

          <div className="main__new-point">
            <NewPoint
              currentCoords = { currentCoords }
              onAddPoint    = { this.onAddPoint }
              placemarkAddress = { currentAddress }
              isLocationFound  = { this.state.isLocationFound }
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
              routeType = { this.state.routeType }
              />
          </div>
        </div>
      </Fragment>
    )
  }
}
