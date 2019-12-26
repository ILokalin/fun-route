import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


export default class extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    text: PropTypes.array.isRequired
  }

  static defaultProps = {
    id: 'undefined_id',
    title: 'N/A',
    image: '',
    text: ['', '']
  }


  render () {
    const {title, image, text, id} = this.props.helpTopic;

    return (
      <div className="help-card">
        <h3 className="help-card__title">{title}</h3>
        <div className="help-card__image-section">
          <img className="help-card__image" src={image} alt={title} />
        </div>
        <p className="help-card__text" align="justify" key={id}>
          {text.map((textNode, index) =>  <Fragment key={index}>
                                            {textNode}
                                          </Fragment>
          )}
        </p>
      </div>
    );
  }
}
