import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


export default class extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    helpTitle: PropTypes.string.isRequired,
    helpPictureSrc: PropTypes.string.isRequired,
    helpText: PropTypes.array.isRequired
  }

  static defaultProps = {
    id: 'undefined_id',
    helpTitle: 'N/A',
    helpPictureSrc: '',
    helpText: []
  }


  render () {
    const {helpTitle, helpPictureSrc, helpText, id} = this.props.helpTopic;

    return (
      <div className="help-card">
        <h3 className="help-card__title">{ helpTitle }</h3>

        <div className="help-card__image-section">
          <img className="help-card__image" src={ helpPictureSrc } alt={ helpTitle } />
        </div>
        
        <p className="help-card__text" align="justify" key={ id }>
          {helpText.map((textFragment, index) =>  <Fragment key={index}>
                                                    {textFragment}
                                                  </Fragment>
          )}
        </p>
      </div>
    );
  }
}
