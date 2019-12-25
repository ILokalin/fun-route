import React from 'react';
import { Link } from 'react-router-dom';


export default class extends React.Component {

  render () {

    return (
      <section className="error-page">
        <p className="error-page__number-404">Точка
          <span className="error-page__number-404--big"> 404</span></p>
        <header className="error-page__header">
          <h2 className="error-page__title">Внимание! Вы ушли с маршрута... </h2>
        </header>
        <p className="error-page__text">Вероятно, была выбрана неверная ссылка в адресной строке. Чтобы вернуться в приложение перейдите по ссылке:
          <Link className="error-page__link" to="/">Вернуться в приложение</Link>
        </p>
      </section>
    )
  }
}