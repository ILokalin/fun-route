import React, { Fragment } from 'react';
import SetNewPointMapImage from '../../assets/set-new-point-map.jpg';
import AddNewPointButtonImage from '../../assets/add-new-point-button.jpg';
import StartEndPointsInRoutImage from '../../assets/start-end-points-in-route.jpg';
import PlacemarkAddressRouteImage from '../../assets/placemark-address-route.jpg';
import ButtonsUpDownImage from '../../assets/buttons-up-down.jpg';
import RouteTypeButton from '../../assets/route-type-button.jpg';
import ButtonRemoveImage from '../../assets/button-remove.jpg';

import IconRemove from '../IconsBtn/IconRemove';
import IconAdd from '../IconsBtn/IconAdd';


export default function () {
  return (
    <Fragment>
      <section className="help">
        <h2 className="help__title-common">Описание работы</h2>
       
        <h3 className="help__title">Выбор точки</h3>
        <p className="help__text">
          <img className="help__image" src={SetNewPointMapImage} alt="установка маркера" />
          Для начала работы необходимо выбрать место начала маршрута на карте и установить 
          маркер. Маркер можно установить пере&shy;таскива&shy;нием маркера из центра карты или кликнув в нужной 
          точке карты левой клавишей мыши.
          </p>

        <h3 className="help__title">Добавление точки</h3>
        <p className="help__text">
          <img className="help__image" src={AddNewPointButtonImage} alt="добавление точки" />
          Адрес отобразится в поле создания новой точки маршрута. В ней можно указать свое 
          название (адрес сохра&shy;нится и будет также указан), уточнить координаты. Для добавления 
          точки необходимо нажать кнопку <IconAdd /> или клавишу Enter в поле для ввода текста.
          </p>

        <h3 className="help__title">Список маршрута</h3>
        <p className="help__text">
          <img className="help__image" src={StartEndPointsInRoutImage} alt="маршрут в списке" />
          Добавляя точки, их описание (адрес, название) размещаются в списке.  Первые 10 получают 
          литер от A до J. В случае, когда название или адрес не помещаются в ширину отведенного поля, 
          можно получить развернутую информацию о точке маршрута, выделив точку левой кнопкой мыши.
          </p>

        <h3 className="help__title">Маркеры на карте</h3>
        <p className="help__text">
          <img className="help__image" src={PlacemarkAddressRouteImage} alt="маркер с адресом" />
          Для каждой точки на карте создается круглый маркер, местоположение соответствует 
          координатам (широта, долгота). Нажав на маркер, откры&shy;вается текущий адрес в соответствии с 
          гео&shy;кодиро&shy;ванием сервиса Яндекс-карты. Добавьте начальную и конечную точку маршрута в списке.
          </p>

        <h3 className="help__title">Изменение последовательности</h3>
        <p className="help__text">
          <img className="help__image" src={ButtonsUpDownImage} alt="кнопки пермещения" />
          Для изменения последовательности маршрута можно перетаскивать элементы в списке, размещая их 
          нужном порядке. Также, можно воспользоваться кнопками, которые открываются при наведении 
          указателя мыши на элемент. В мобильной версии кнопки для пере&shy;мещения вверх/вниз открыты всегда, 
          а литеры точек, в списке не указываются.
          </p>

        <h3 className="help__title">Удаление точки</h3>
        <p className="help__text">
          <img className="help__image" src={ButtonRemoveImage} alt="кнопка удаления" />
          Удалить точку из маршрута можно нажатием кнопки <IconRemove />, нахо&shy;дя&shy;щейся у каждого элемента в списке. 
          Отменить удаление невозможно.
          </p>

        <h3 className="help__title">Режимы отображения маршрута</h3>
        <p className="help__text">
          <img className="help__image" src={RouteTypeButton} alt="кнопки пермещения" />
          Составленный маршрут можно представить в виде проложенного пути. Для этого необходимо переключить режим, 
          выбрав “Показать маршрут на карте”. Вернуться в режим редактирования, можно установив переключатель в 
          обратное положение.
          </p>
      </section>
    </Fragment>
    
  )
}