import React from 'react';
import PropTypes from 'prop-types';
import IconRound from 'components/IconsBtn/IconRound';
import IconRoute from 'components/IconsBtn/IconRoute';


export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.changeRoutType = this.changeRoutType.bind(this);
  }

  static propReact = {
    routeType: PropTypes.oneOf(['polyline', 'multiRoute']).isRequired,
    onChangeRoutType: PropTypes.func.isRequired
  }

  changeRoutType (event) {
    const { target: { checked } } = event;

    this.props.onChangeRoutType({
      value: checked
    });
  }
  
  render () {
    const { routeType } = this.props;
    const stringCaption = (routeType === 'polyline') ? 'Показать маршрут на карте' : 'Вернуть режим редактирования'

    return (
      <div className="route-type">
        <IconRoute />
        <h3 className="route-type__caption">{ stringCaption }</h3>
        <label className="route-type__label" htmlFor="type-toggle">
          <input  className="route-type__toggle"
                id="type-toggle"
                type="checkbox"
                name="routeType"
                checked={this.props.value }
                value="route"
                onChange={ this.changeRoutType }
                data-index={ this.props.index } />
          <span className="route-type__toggle-marker"></span>
          <IconRound />
        </label>
      </div>
      );
  }
}
