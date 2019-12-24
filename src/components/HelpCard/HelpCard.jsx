import React from 'react';
import PropTypes from 'prop-types';


export default class extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.array
  }

  render () {
    const {title, image, text} = this.props;

    return (
      <div className="help__card">
                <h3 className="help__title">{title}</h3>
                <div className="help__image-section">
                  <img className="help__image" src={image} alt={title} />
                </div>
                <p className="help__text" align="justify">
                  {text.map(textNode => textNode )}
                </p>
      </div>
    );
  }
}
