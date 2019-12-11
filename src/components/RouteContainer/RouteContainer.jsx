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
        this.props.onUpPoint(itemIndex)

      } else if (button.value === 'down') {
        this.props.onDownPoint(itemIndex)

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


  newIndexReady (id) {
    const newItemsList = [...document.querySelector('.route').children]
    const newIndex = newItemsList.findIndex(element => element.dataset.index === id);

    this.props.onChangeSequence(newIndex, id);
  }


  render() {
    const {routePoints} = this.props;
    
    return (
      <ul className="route" onClick ={this.hendlePoint}>
        {routePoints.map((point, index) =>  <RoutePoint   
                                              point = {point}
                                              key   = {point.id} 
                                              pointLetter   = {index < 10 ? String.fromCharCode(index + 65) : ''}
                                              newIndexFind  = {this.newIndexReady}
                                              />)}
      </ul>
    );
  }
}