import React, {Fragment} from 'react';
import CoordsToString from '../CoordsToString';
import IconAdd from '../IconsBtn/IconAdd';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handleAddPoint = this.handleAddPoint.bind(this);
  }


  getInput = el => {
    this.input = el;
  }

  
  keyDown (keyPress) {
    if (keyPress === 'Enter') {
      this.handleAddPoint();
    }
  }


  handleAddPoint () {
    this.props.onAddPoint(this.input.value);
    this.input.value = '';
  }


  render () {
    const {placemarkAddress, currentCoords, isLocationFound} = this.props;
    const hintString = `координаты: ${CoordsToString(currentCoords)}`;
    const disabledValue = isLocationFound ? '' : 'disabled'

    return (
        <Fragment>
          <div className="new-point">
            <input  className="new-point__input"
                    disabled={ disabledValue }
                    title="Добавьте точку в маршрут"
                    type="text"
                    ref={ this.getInput }
                    name="address"
                    autoComplete="off"
                    onKeyDown={(e) => this.keyDown(e.key)}
                    placeholder={placemarkAddress}
                    />
            <h3 className="new-point__caption">Назовите новую точку</h3>
            <button className="new-point__add-button" type="button" disabled={ disabledValue } onClick={ this.handleAddPoint }>
              <IconAdd />
            </button>
            <p className="new-point__description">{ hintString }</p>
          </div>
        </Fragment>
      );
  }
}