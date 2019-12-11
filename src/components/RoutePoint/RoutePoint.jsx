import React from 'react';
import IconRemove from '../IconsBtn/IconRemove';
import IconUp from '../IconsBtn/IconUp';
import IconDown from '../IconsBtn/IconDown';
import CoordsToString from '../CoordsToString/CoordsToString';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
  }


  onDragStart (event) {
    event.preventDefault();

    const target = event.target;

    const targetWidth  = parseInt(getComputedStyle(target).width);
    const targetHeight = parseInt(getComputedStyle(target).height);
    target.style.width = targetWidth + 'px';
    target.style.position = 'absolute';
    target.style.zIndex = 10000;

    const reservePositionElement = document.createElement('div');
    target.before(reservePositionElement);
    document.body.append(target);

    moveAt(event.pageX, event.pageY);

    function moveAt (pageX, pageY) {
      target.style.left = pageX - targetWidth  / 2 + 'px';
      target.style.top  = pageY - targetHeight / 2 + 'px';
    }


    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }


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
    const {id, name} = this.props.point,
          address = this.props.point.properties.get('balloonContent'),
          coords = this.props.point.geometry.getCoordinates(),
          elementHint = `координаты: ${CoordsToString(coords)}`;
   

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
        <div className="route__item-caption"  title={ elementHint }>
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