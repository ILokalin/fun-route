import React from 'react';
import CoordsToString from '../CoordsToString';
import IconDown from '../IconsBtn/IconDown';
import IconRemove from '../IconsBtn/IconRemove';
import IconUp from '../IconsBtn/IconUp';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
  }


  /** 
   * Начало "перетаскивания" точки в маршруте в списке
   * С эстетической точки зрения используется собственный обработчик события Drag
   * и отменяется стандртаная обработка.
   * @function
   * @name onDragStart
   * @params {object.event} event - событие
   * @return {boolean} false
   */
  onDragStart (event) {
    event.preventDefault();

    const target = event.target;

    const targetWidth  = parseInt(getComputedStyle(target).width);
    const targetHeight = parseInt(getComputedStyle(target).height);
    target.style.width = targetWidth + 'px';
    target.style.position = 'absolute';
    target.style.zIndex = 10000;

    // резервируется место для возврата элемента
    const reservePositionElement = document.createElement('div');
    target.before(reservePositionElement);
    document.body.append(target);

    moveAt(event.pageX, event.pageY);

    /**
     * запись координат для абсолютного позиционирования элемента на экране
     */
    function moveAt (pageX, pageY) {
      target.style.left = pageX - targetWidth  / 2 + 'px';
      target.style.top  = pageY - targetHeight / 2 + 'px';
    }


    // Перемещение элемента за курсором мыши
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    /**
     * Нажатая кнопка мыши отжата
     * Если элемент находится за пределами контейнера с маршрутом, то возвращаем
     * элемент на зарезервированное место и отменяем перенос
     * Если элемент находится над другим элементом маршрута, то читаем его id
     * ставим на новое место и вызываем событие для изменения последовательности
     * @function
     * @name onMouseUp
     * @params {object.event} event - событие мыши "кнопка отжата"
     */
    this.onMouseUp = (event) => {
      target.style.top = '-500px';
      const elementDropEnd = document.elementFromPoint(event.pageX, event.pageY);

      document.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('mouseup', this.onMouseUp);

      target.style.width = '';
      target.style.position = '';
      target.style.zIndex = '';
      target.style.top = '';
      target.style.left = '';

      const beforeItem = elementDropEnd.closest('.route__item');

      if (beforeItem) {
        beforeItem.before(target);
        this.props.newIndexFind(target.dataset.index)

      } else {
        const inRouteContainer = elementDropEnd.closest('.route');

        if (inRouteContainer) {
          inRouteContainer.append(target);
          this.props.newIndexFind(target.dataset.index)

        } else {
          reservePositionElement.before(target);

        }
      }

      reservePositionElement.remove()
    }

    // При выходе мыши за пределы экрана возвращаем элемент в его прежнюю позицию, отменяем перетаскивание
    this.onMouseOut = (event) => {
      if (event.relatedTarget === null)  {
        target.style.width = '';
        target.style.position = '';
        target.style.zIndex = '';
        target.style.top = '';
        target.style.left = '';

        reservePositionElement.before(target);
        reservePositionElement.remove()

        document.removeEventListener('mousemove', onMouseMove);
        target.removeEventListener('mouseup', this.onMouseUp);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseout', this.onMouseOut);
    target.addEventListener('mouseup', this.onMouseUp);

    return false;
  }


  render () {
    const {point, point: {name, geometry: {id}}} = this.props
    const address = point.properties.get('balloonContent'),
          coords  = point.geometry.getCoordinates(),
          coordsHint = `координаты: ${CoordsToString(coords)}`;

    return (
      <li className="route__item" data-index={ id } draggable="true" onDragStart={ this.onDragStart }>
        <div className="route__item-control">
          <h3 className="route__item-letter">{ this.props.pointLetter }</h3>
          <button className="route__item-button" type="button" value="up"  >
            <IconUp/>
          </button>
          <button className="route__item-button" type="button" value="down">
            <IconDown/>
          </button>
        </div>
        <div className="route__item-caption"  title={ coordsHint }>
          <h3 className="route__item-address">{ address }</h3>
          <p  className="route__item-name">{ name }</p>
        </div>
        <button className='route__item-button route__item-button--remove' type='button' value='remove'>
          <IconRemove />
        </button>
      </li>
      )
  }
}