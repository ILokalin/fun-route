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
    onChangeSequence: PropTypes.func.isRequired,
    point:        PropTypes.object.isRequired,
    pointLetter:  PropTypes.string.isRequired,
  }

  static propsDefault = {
    onChangeSequence: () => false,
    point: {
      name: '',
      geometry: {
        id: 'default-id',
        getCoordinates: () => [0,0]
      },
      properties: {
        get: (content) => {
          if (content === 'balloonContent') {
            return 'default Address';
          }
        }
      }
    },
    pointLetter: '~'
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
          targetHeight = parseInt(getComputedStyle(target).height),
          targetWidth  = parseInt(getComputedStyle(target).width);

    // шаблон для подсветки предполагаемого размещения элемента
    const reservePositionForLanding = document.createElement('div');
    reservePositionForLanding.classList.add('route__item--landing-position');
    reservePositionForLanding.style.height = '61px';
    reservePositionForLanding.style.width = '100%';

    // резервируется место для возврата элемента
    const reservePositionElement = document.createElement('div');
    target.before(reservePositionElement);

    // Фиксируем высоту списка с элементами для избежания скачков
    const routeContainer = document.querySelector('.route');
    routeContainer.style.height = `${routeContainer.getBoundingClientRect().height}px`;

    // Выбранный элемент необходимо перезакрепить на document.body, оформить и заменить подсветкой в списке
    target.style.borderRadius = '4px';
    target.style.position = 'absolute';
    target.style.width = targetWidth + 'px';
    target.style.zIndex = 10000;
    target.style.boxShadow = '0px 11px 12px 0px rgba(50, 50, 50, 0.5)'

    document.body.append(target);
    reservePositionElement.before(reservePositionForLanding);

    // вспомогательные перменные для контроля размещения подсветки и хранения координат всех точек маршрута
    let currentItemForLanding = null,
        coordsLandingList = [],
        isAboveContainer = true,
        isOutOfContainerFix = false;

    /**
     * Создание списка с координатами всех точек маршрта оставшихся в списке и ссылками на них
     * Требуется для сверки текущего положения перемещаемого элемента.
     * @const
     * @return coordsLandingList {array}
     */
    const createLandingList = () => {
      const itemsList = [...routeContainer.querySelectorAll('.route__item')];

      coordsLandingList = itemsList.map(item => {
      const bound = item.getBoundingClientRect();

      return {
        width: bound.width,
        height: bound.height,
        item: item,
        x: bound.left,
        y: bound.top,
        }
      })
    }

    // Восстановление стилей элемента и контейнера
    const routeStyleReset = () => {
      target.style = {};
      routeContainer.style.height = '';
    }

    // корректировка текущего положения элемента относительно курсора 
    moveAt(event.pageX, event.pageY);


    /**
     * Запись координат для абсолютного позиционирования элемента на экране.
     * Центр элемента принимает координаты мыши
     *
     * @function
     * @name moveAt
     * @params  {number, number} - pageX, pageY - положение курсора мыши на экране
     */
    function moveAt (pageX, pageY) {
      const x = pageX - targetWidth  / 2;
      const y = pageY - targetHeight / 2;

      target.style.left = `${x}px`;
      target.style.top  = `${y}px`;
    }


    /**
     * Отслеживание движение мыши с зажатой клавишей - перетаскивание элемента.
     * 
     * Задача: подсвечивать место для возможной вставки элемнта в список
     *
     * Используемые термины:
     * Элемент - перетаскиваемый элемент из списка.
     * Точка - маршрутная точка в спсике над которым происходит перенос ('.route__item')
     * Список - имеющийся маршрут в классе '.route'
     * @function
     * @name onMouseMove
     * @params {event.object} event - событие с текущими координатами мыши
     */
    function onMouseMove(event) {
      const { pageX, pageY, clientX, clientY } = event;

      moveAt(pageX, pageY);

      createLandingList();

      const checkCurrentPosition = coordsLandingList.find(point => {
        const top = point.y,
              left = point.x,
              bottom = point.y + point.height,
              right = point.x + point.width;

        if ((top <= clientY + 2) && (bottom >= clientY - 2)  && left <= clientX && right >= clientX ) {

          return point;
        } else {

          return false;
        }
      })


      /**
       * Проверка положения перетасикваемого элемента. 
       *
       * Во время перетаскивания элемента отслеживается его положение над другими точками маршрута в списке. 
       * Разделяется несколько положений элемента:
       * - элемент над списком, над одной из точек (был над ней или появился) - перед ней или после включается подсветка
       * - элемент над контейнером И над подсветкой вставки - без изменений
       * - элемент над контейнером И не над списком И не над подсветкой - убрать подсветку, вставка будет в хвост списка
       * - элемент за пределами контейнера - подсветка в резерв для возврата элемента
       */
      if (checkCurrentPosition) {
        const {y, height} = checkCurrentPosition;

        // если вернулись с элементом на список
        if (!isAboveContainer) {
          isAboveContainer = true;
          isOutOfContainerFix = false;
        }

        /**
         * Точка для посадки уже была выбрана && она прежняя - проверить расположение вставки, До или После точки
         * Если сменилась точка над которой элемент, то определяется и устанвливается вид вставки - До/После
         */
        if (currentItemForLanding && checkCurrentPosition.item.dataset.index === currentItemForLanding.dataset.index) {
          
          if (clientY > y + height / 2 && currentItemForLanding.position === 'before') {

            currentItemForLanding.after(reservePositionForLanding);
            currentItemForLanding.position = 'after';

          } else if (clientY <= y + height / 2 && currentItemForLanding.position === 'after') {
            currentItemForLanding.before(reservePositionForLanding);
            currentItemForLanding.position = 'before';

          }
        } else {
          currentItemForLanding = checkCurrentPosition.item;

          if (clientY > y + height / 2) {
            currentItemForLanding.after(reservePositionForLanding);
            currentItemForLanding.position = 'after';

          } else {
            currentItemForLanding.before(reservePositionForLanding);
            currentItemForLanding.position = 'before';

          }
        }
      } else if (!checkCurrentPosition) {

        // Проверить нахождение над контенером
        {
          const { top, left, bottom, right } = routeContainer.getBoundingClientRect();
          
          if ( clientY > top && clientY < bottom && clientX > left && clientX < right ) {
            isAboveContainer = true;
          } else {
            isAboveContainer = false;
          }
        }

        /**
         * Проверка нахождения элемента:
         * - за пределами контейнера со списком маршрута - подсветка на место, где элемент забрали
         * - в пределах контейнера - значит вставка в хвост списка - убрать подсветку
         */
        if (isAboveContainer) {
          const {top, left, bottom, right } = reservePositionForLanding.getBoundingClientRect();

          if ( !(clientY + 2 >= top  && clientY - 2 <= bottom && clientX >= left && clientX <= right) ) {
              reservePositionForLanding.remove();
              currentItemForLanding = null;
              isOutOfContainerFix = false;
            } 
          } else if (!isAboveContainer) {
            if (!isOutOfContainerFix) {
              reservePositionElement.before(reservePositionForLanding);
              currentItemForLanding = null;
              isOutOfContainerFix = true;
            }
          }
      } 
      
    }


    /**
     * Нажатая кнопка мыши отжата
     *
     * Если элемент находится за пределами контейнера с маршрутом, то возвращаем
     * элемент на зарезервированное место и отменяем перенос
     * Если элемент находится над другим элементом маршрута, то читаем его id
     * ставим на новое место и вызываем событие для изменения последовательности
     *
     * @function
     * @name    onMouseUp
     * @params  {object.event} event - событие мыши "кнопка отжата"
     */
    this.onMouseUp = (event) => {
      document.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('mouseup', this.onMouseUp);

      reservePositionForLanding.remove();
      reservePositionElement.before(target);
      reservePositionElement.remove();
      routeStyleReset();

      const index = target.dataset.index

      if (currentItemForLanding) {
        let newIndex = coordsLandingList.findIndex(element => element.item.dataset.index === currentItemForLanding.dataset.index);

        if (currentItemForLanding.position === 'after') {
          newIndex++;
        }

        this.props.onChangeSequence(newIndex, index);
      } else if (isAboveContainer) {
        let newIndex = coordsLandingList.length;

        this.props.onChangeSequence(newIndex, index);
      }
    }

    // При выходе мыши за пределы экрана возвращаем элемент в его прежнюю позицию, отменяем перетаскивание
    this.onMouseOut = (event) => {
      if (event.relatedTarget === null)  {
        document.removeEventListener('mousemove', onMouseMove);
        target.removeEventListener('mouseup', this.onMouseUp);

        reservePositionElement.before(target);
        reservePositionElement.remove();
        reservePositionForLanding.remove();

        routeStyleReset();
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
