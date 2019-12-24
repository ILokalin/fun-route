import React from 'react';
import PropTypes from 'prop-types';
import CoordsToString from 'components/CoordsToString';
import IconDown from 'components/IconsBtn/IconDown';
import IconRemove from 'components/IconsBtn/IconRemove';
import IconUp from 'components/IconsBtn/IconUp';



export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
  }


  static routeType = {
    point:        PropTypes.object.isRequired,
    newIndexFind: PropTypes.func.isRequired,
    pointLetter:  PropTypes.string,
  }

  static propsDefault = { 
    pointLetter: 'X'
  }


  /** 
   * Начало "перетаскивания" точки в маршруте в списке
   * С эстетической точки зрения используется собственный обработчик события Drag
   * и отменяется стандртаная обработка.
   * @function
   * @name    onDragStart
   * @params  {object.event} event - событие
   * @return  {boolean} false
   */
  onDragStart (event) {
    event.preventDefault();

    const target = event.target,
          targetWidth  = parseInt(getComputedStyle(target).width),
          targetHeight = parseInt(getComputedStyle(target).height);

    // шаблон для вставки перенесенного элемента
    const reservePositionForLanding = document.createElement('div');
    reservePositionForLanding.style.height = '25px';
    reservePositionForLanding.style.width = '100%';
    reservePositionForLanding.classList.add('route__item--landing-position');

    let currentItemForLanding, 
        coordsLandingList;

    // резервируется место для возврата элемента
    const reservePositionElement = document.createElement('div');
    target.before(reservePositionElement);

    // Фиксируем высоту списка с элементами для избежания скачков
    const routeContainer = document.querySelector('.route');
    routeContainer.style.height = `${routeContainer.getBoundingClientRect().height}px`;

    // Выбранный элемент необходимо перезакрепить на document
    target.style.width = targetWidth + 'px';
    target.style.position = 'absolute';
    target.style.zIndex = 10000;
    target.style.borderRadius = '4px';

    document.body.append(target);

    function loadLandingList () {
      const itemsList = [...routeContainer.querySelectorAll('.route__item')];

      coordsLandingList = itemsList.map(item => {
      const bound = item.getBoundingClientRect();

      return {
        item: item,
        x: bound.left,
        y: bound.top,
        width: bound.width,
        height: bound.height
      }
    })
    }

    // корректировка текущего положения элемента относительно курсора 
    moveAt(event.pageX, event.pageY);

    /**
     * запись координат для абсолютного позиционирования элемента на экране
     */
    function moveAt (pageX, pageY) {
      const x = pageX - targetWidth  / 2;
      const y = pageY - targetHeight / 2;

      target.style.left = `${x}px`;
      target.style.top  = `${y}px`;
    }


    // Перемещение элемента за курсором мыши
    function onMouseMove(event) {
      const {pageX, pageY, clientX, clientY } = event;

      moveAt(pageX, pageY);

      loadLandingList();

      const checkCureentPosition = coordsLandingList.find(element => {
        const top = element.y,
              left = element.x,
              bottom = element.y + element.height,
              right = element.x + element.width;

        if ((top <= clientY || top <= clientY + 2) && (bottom >= clientY || bottom >= clientY - 2)  && left <= clientX && right >= clientX ) {
          return element;
        } else {
          return false;
        }
      })

      if (checkCureentPosition) {
        const {y, height} = checkCureentPosition;
        if (currentItemForLanding && checkCureentPosition.item.dataset.index === currentItemForLanding.dataset.index) {
          if (clientY > y + height / 2 && currentItemForLanding.position === 'before') {

            currentItemForLanding.after(reservePositionForLanding);
            currentItemForLanding.position = 'after';

          } else if (clientY <= y + height / 2 && currentItemForLanding.position === 'after') {
            currentItemForLanding.before(reservePositionForLanding);
            currentItemForLanding.position = 'before';

          }
        } else {
          if (clientY > y + height / 2) {
            currentItemForLanding = checkCureentPosition.item;
            currentItemForLanding.after(reservePositionForLanding);
            currentItemForLanding.position = 'after';

          } else {
            currentItemForLanding = checkCureentPosition.item;
            currentItemForLanding.before(reservePositionForLanding);
            currentItemForLanding.position = 'before';

          }
        }
      } else if (!checkCureentPosition) {
        if (currentItemForLanding) {
          const {top, left, bottom, right } = reservePositionForLanding.getBoundingClientRect();

          if ((clientY >= top || clientY + 2 >= top ) && (clientY <= bottom || clientY - 2 <= bottom ) && clientX >= left && clientX <= right) {

          } else { 
            reservePositionForLanding.remove();
            currentItemForLanding = false;
          }
        } else { 
          reservePositionForLanding.remove();
          currentItemForLanding = false;
        }
      }
    }


    /**
     * Нажатая кнопка мыши отжата
     * Если элемент находится за пределами контейнера с маршрутом, то возвращаем
     * элемент на зарезервированное место и отменяем перенос
     * Если элемент находится над другим элементом маршрута, то читаем его id
     * ставим на новое место и вызываем событие для изменения последовательности
     * @function
     * @name    onMouseUp
     * @params  {object.event} event - событие мыши "кнопка отжата"
     */
    this.onMouseUp = (event) => {
      target.style.top = '-500px';
      const elementDropEnd = document.elementFromPoint(event.clientX, event.clientY);

      document.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('mouseup', this.onMouseUp);

      target.style.width = '';
      target.style.position = '';
      target.style.zIndex = '';
      target.style.top = '';
      target.style.left = '';
      target.style.borderRadius = '';
      routeContainer.style.height = '';

      if (currentItemForLanding) {
        if (currentItemForLanding.position === 'before') {
          currentItemForLanding.before(target);
        } else {
          currentItemForLanding.after(target);
        }

        reservePositionElement.remove();
        reservePositionForLanding.remove();
        this.props.newIndexFind(target.dataset.index)
      } else {
        const inRouteContainer = elementDropEnd.closest('.route');

        if (inRouteContainer) {
          inRouteContainer.append(target);
          reservePositionElement.remove();
          this.props.newIndexFind(target.dataset.index)

        } else {
          reservePositionElement.before(target);
          reservePositionElement.remove();
        }

      }
    }

    // При выходе мыши за пределы экрана возвращаем элемент в его прежнюю позицию, отменяем перетаскивание
    this.onMouseOut = (event) => {
      if (event.relatedTarget === null)  {
        target.style.width = '';
        target.style.position = '';
        target.style.zIndex = '';
        target.style.top = '';
        target.style.left = '';
        target.style.borderRadius = '';
        routeContainer.style.height = '';

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