import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import CoordsToString from 'components/CoordsToString';
import IconAdd from 'components/IconsBtn/IconAdd';


export default class extends React.Component {

  static propTypes = {
    onAddPoint:       PropTypes.func.isRequired,
    isLocationFound:  PropTypes.bool.isRequired,
    placemarkAddress: PropTypes.string,
    currentCoords:    PropTypes.array
  }

  static defaultProps = {
    onAddPoint: () => false,
    isLocationFound: false,
    currentCoords:    [0,0],
    placemarkAddress: ''
  }


  constructor (props) {
    super(props);

    this.handleAddPoint = this.handleAddPoint.bind(this);
  }

  
  keyDown (keyPress) {
    if (keyPress === 'Enter') {
      this.handleAddPoint();
    }
  }


  handleAddPoint () {
    this.props.onAddPoint(this.inputRef.value);
    this.inputRef.value = '';
  }


  render () {
    const {placemarkAddress, currentCoords, isLocationFound} = this.props;
    const hintString = `координаты: ${ CoordsToString(currentCoords) }`;
    const disabledValue = isLocationFound ? '' : 'disabled'

    return (
        <Fragment>
          <div className="new-point">
            <input  className="new-point__input"
                    disabled={ disabledValue }
                    title="Добавьте точку в маршрут"
                    type="text"
                    ref={(ref) => { this.inputRef = ref; }}
                    name="address"
                    autoComplete="off"
                    onKeyDown={ (e) => this.keyDown(e.key) }
                    placeholder={ placemarkAddress  }
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
