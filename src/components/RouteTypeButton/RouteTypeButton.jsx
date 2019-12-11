import React from 'react';
import IconRoute from '../IconsBtn/IconRoute';
import IconRound from '../IconsBtn/IconRound';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.changeRoutType = this.changeRoutType.bind(this);
  }

  changeRoutType (event) {
    const { target: { checked } } = event;

    this.props.onChangeRoutType({
      value: checked
    });
  }
  
  render () {

    return (
      <div className="route-type">
        <IconRoute />
        <h3 className="route-type__caption">Показать маршрут на&nbsp;карте</h3>
        <input  className="route-type__toggle"
                id="type-toggle"
                type="checkbox"
                name="routType"
                checked={this.props.value }
                value="route"
                onChange={ this.changeRoutType }
                data-index={ this.props.index } />
        <label className="route-type__toggle-marker" htmlFor="type-toggle">
            <IconRound />
        </label>
      </div>
      );
  }
}