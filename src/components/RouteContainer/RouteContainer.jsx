import React from 'react';
import RoutePoint from '../../components/RoutePoint/RoutePoint';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.hendlePoint = this.hendlePoint.bind(this);
    this.newIndexReady = this.newIndexReady.bind(this);
  }

  hendlePoint (event) {
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
        debugger
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


  positionIdInRoute (id) {
    const itemsList = [...document.querySelector('.route').children]
    return itemsList.findIndex(element => element.dataset.index === id);
  }

  newIndexReady (id) {
    const newIndex = this.positionIdInRoute(id)
    // const newItemsList = [...document.querySelector('.route').children]
    // const newIndex = newItemsList.findIndex(element => element.dataset.index === id);

    this.props.onChangeSequence(newIndex, id);
  }


  render() {
    const {routePoints} = this.props;
    
    return (
      <ul className="route" onClick ={this.hendlePoint}>
        {routePoints.map((point, index) =>  <RoutePoint   
                                              point = {point}
                                              key   = {point.geometry.id} 
                                              pointLetter   = {index < 10 ? String.fromCharCode(index + 65) : ''}
                                              newIndexFind  = {this.newIndexReady}
                                              />)}
      </ul>
    );
  }
}