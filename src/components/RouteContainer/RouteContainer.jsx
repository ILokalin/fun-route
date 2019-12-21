import React from 'react';
import PropTypes from 'prop-types';
import RoutePoint from '../RoutePoint';



export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handlePoint = this.handlePoint.bind(this);
    this.newIndexReady = this.newIndexReady.bind(this);
  }


  static propTypes = {
    routePoints:    PropTypes.array.isRequired,
    onDeletePoint:  PropTypes.func.isRequired,
    onViewPoint:    PropTypes.func.isRequired,
    onChangeSequence: PropTypes.func.isRequired
  }


  /**
   * Управление событиями на точке маршрута:
   * - нажатие кнопок "вверх"/"вниз"
   * - нажатие кнопки "удалить"
   * - нажатие на элемент для раскрытия подробного содержания и показа точки в центер карты
   * @function
   * @name handlePoint
   * @params {object.event} event - событие
   */
  handlePoint (event) {
    const target = event.target;    
    const itemIndex = target.closest('.route__item') ? target.closest('.route__item').dataset.index : ''

    const button = target.closest('.route__item-button');

    if (typeof(button) !== 'undefined' && button) {
      if (button.value === 'up') {
        const position = this.positionIdInRoute(itemIndex);
        const newIndex = (position === 0) ? document.querySelectorAll('.route__item').length -1 : position - 1;
        this.props.onChangeSequence(newIndex, itemIndex);

      } else if (button.value === 'down') {
        const position = this.positionIdInRoute(itemIndex);
        const newIndex = (position === document.querySelectorAll('.route__item').length -1) ? 0 : position + 1;
        this.props.onChangeSequence(newIndex, itemIndex);

      } else if (button.value === 'remove') {
        this.props.onDeletePoint(itemIndex)

      }
    } else {

      const caption = target.closest('.route__item')
      
      if (typeof(caption) !== 'undefined' && caption)  {

        if (!caption.classList.contains('route__item--active')) {
          const deactivateList = [...caption.closest('.route').querySelectorAll('.route__item')]

          deactivateList.forEach(elem => {
          elem.classList.remove('route__item--active')
          })

          this.props.onViewPoint(itemIndex)
        }

        caption.closest('.route__item').classList.toggle('route__item--active')
      }
    }
  }


  /**
   * Поиск позиции в спике маршрута по id
   * Применяется для смены последовательсности точек
   * @function
   * @name positionIdInRoute
   * @params {string} id - уникальный идентификатор
   * @return {number} - текущий индекс элемента в списке маршрута
   */
  positionIdInRoute (id) {
    const itemsList = [...document.querySelector('.route').children]
    return itemsList.findIndex(element => element.dataset.index === id);
  }


  /**
   * После перемещения точки в маршруте, при готовности нового индекса, 
   * вызов запроса на смену последовательности в соновном наборе данных
   */
  newIndexReady (id) {
    const newIndex = this.positionIdInRoute(id)
    this.props.onChangeSequence(newIndex, id);
  }


  render() {
    const {routePoints} = this.props;

    return (
      <ul className="route" onClick ={this.handlePoint}>
        {routePoints.map((point, index) =>  <RoutePoint   
                                              point = {point}
                                              key   = {point.geometry.id} 
                                              pointLetter   = {index < 26 ? String.fromCharCode(index + 65) : ''}
                                              newIndexFind  = {this.newIndexReady}
                                              />)}
      </ul>
    );
  }
}