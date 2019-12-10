import React from 'react';
import CoordsToString from '../CoordsToString/CoordsToString';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handleAddPoint = this.handleAddPoint.bind(this);
  }


  handleAddPoint () {
    this.props.onAddPoint();
  }


  render () {
    const hintString = CoordsToString(this.props.currentCoords);

    return (
      <div className="new-point">
        <p className="new-point__description">{hintString}</p>
        <button className="new-point__add-button" type="button" onClick={this.handleAddPoint}>add</button>
      </div>
    )
  }
}