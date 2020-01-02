import React from 'react';
import PropTypes from 'prop-types';
import IconRound from 'components/IconsBtn/IconRound';
import IconRoute from 'components/IconsBtn/IconRoute';


const ROUTE_TYPE = { POLYLINE: 'polyline' },
      TEXT_POLYLINE_TYPE = 'Показать маршрут на карте',
      TEXT_MULTIROUTE_TYPE = 'Вернуть режим редактирования';

export default class extends React.PureComponent {
  constructor (props) {
    super(props);

    this.changeRoutType = this.changeRoutType.bind(this);
  }

  static propTypes = {
    routeType: PropTypes.oneOf(['polyline', 'multiRoute']).isRequired,
    onChangeRoutType: PropTypes.func.isRequired,
  }

  static defaultProps = {
    routeType: ROUTE_TYPE.POLYLINE,
    onChangeRoutType: () => false,
  }


  changeRoutType (event) {
    const { target: { checked } } = event;

    this.props.onChangeRoutType(checked);
  }
  

  render () {
    const { routeType } = this.props;

    const routeTypeState = (routeType === ROUTE_TYPE.POLYLINE) ? false : true;
    const routeTypeCaption = routeTypeState ? TEXT_MULTIROUTE_TYPE : TEXT_POLYLINE_TYPE;

    return (
      <div className="route-type">
        <IconRoute />
        <h3 className="route-type__caption">{ routeTypeCaption }</h3>
        <label className="route-type__label">
          <input  className="route-type__toggle"
                  type="checkbox"
                  name="routeType"
                  checked={ routeTypeState }
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
