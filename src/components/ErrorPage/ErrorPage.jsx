import React from 'react';
import { Link } from 'react-router-dom';


export default class extends React.Component {

  render () {

    return (
      <section className="error-page">
        <header className="error-page__header">
          <h2 className="error-page__title">Несуществующая страница</h2>
        </header>
        <p className="error-page__text">Страница есть... информации нет. Чтобы вернуться в приложение перейдите по ссылке:
          <Link className="error-page__link" to="/">Вернуться в приложение</Link>
        </p>
      </section>
    )
  }
}