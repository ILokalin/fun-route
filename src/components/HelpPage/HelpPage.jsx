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
      <section className="help">
        <header className="help__header">
          <h2 className="help__title-page">Описание работы</h2>
        </header>
        
        <div className="help__rules-container">
          <div className="help__card">
            <h3 className="help__title">Выбор точки</h3>
            <div className="help__image-section">
              <img className="help__image" src={SetNewPointMapImage} alt="установка маркера" />
            </div>
            <p className="help__text" align="justify">
              Для начала работы необходимо выбрать место начала ма&shy;ршрута на карте и уста&shy;новить 
              маркер. Маркер можно установить пере&shy;таски&shy;ва&shy;нием маркера из центра карты или кликнув в нужной 
              точке ка&shy;рты левой клавишей мыши.
            </p>
          </div>
          
          <div className="help__card">
            <h3 className="help__title">Добавление точки</h3>
            <div className="help__image-section">
              <img className="help__image" src={AddNewPointButtonImage} alt="добавление точки" />
            </div>
            <p className="help__text" align="justify">
              Адрес отобразится в поле создания новой точки маршрута. В поле можно указать свое 
              название для точки (адрес сохра&shy;нится и будет также указан), уточнить координаты. Для добавления 
              точки необходимо нажать кнопку <IconAdd /> или клавишу Enter в поле для ввода текста.
            </p>
          </div>
  
          <div className="help__card">
            <h3 className="help__title">Список маршрута</h3>
            <div className="help__image-section">
              <img className="help__image" src={StartEndPointsInRoutImage} alt="маршрут в списке" />
            </div>
            <p className="help__text" align="justify">
              Добавляя точки, их описание (адрес, название) разме&shy;щаются в списке.  Первые 10 получают 
              литер от A до J. В случае, когда название или адрес не помещаются в ширину отведенного поля, 
              можно получить разве&shy;рнутую информацию о точке маршрута, выделив точку левой кнопкой мыши.
            </p>
          </div>
  
          <div className="help__card">
            <h3 className="help__title">Маркеры на карте</h3>
            <div className="help__image-section">
              <img className="help__image" src={PlacemarkAddressRouteImage} alt="маркер с адресом" />
            </div>
            <p className="help__text" align="justify">
              Для каждой точки на карте создается круглый маркер, место&shy;положение соответствует 
              координатам (широта, долгота). Нажав на маркер, откры&shy;вается текущий адрес в соответствии с 
              гео&shy;кодиро&shy;ванием сервиса Яндекс-карты. Добавьте начальную и конечную точку маршрута в списке.
            </p>
          </div>
  
          <div className="help__card">
            <h3 className="help__title">Изменение последовательности</h3>
            <div className="help__image-section">
              <img className="help__image" src={ButtonsUpDownImage} alt="кнопки пермещения" />
            </div>
            <p className="help__text" align="justify">
              Для изменения последовательности маршрута можно перетаскивать элементы в списке, размещая их 
              нужном порядке. Также, можно воспользоваться кнопками, которые открываются при наведении 
              указателя мыши на элемент. В мобильной версии кнопки для пере&shy;мещения вверх/вниз открыты всегда, 
              а литеры точек, в списке не указываются.
            </p>
          </div>
  
          <div className="help__card">
            <h3 className="help__title">Удаление точки</h3>
            <div className="help__image-section">
              <img className="help__image" src={ButtonRemoveImage} alt="кнопка удаления" />
            </div>
            <p className="help__text" align="justify">
              Удалить точку из маршрута можно нажатием кнопки <IconRemove /> нахо&shy;дя&shy;щейся у каждого элемента в списке. 
              Отменить удаление нево&shy;зможно.
            </p>
          </div>
  
          <div className="help__card">
            <h3 className="help__title">Режимы отображения маршрута</h3>
            <div className="help__image-section">
              <img className="help__image" src={RouteTypeButton} alt="кнопки пермещения" />
            </div>
            <p className="help__text" align="justify">
              Составленный маршрут можно представить в виде проло&shy;женного пути. Для этого необходимо переключить режим, 
              выбрав “Показать маршрут на карте”. Вернуться в режим редактирования, можно установив переключатель в 
              обра&shy;тное положение.
            </p>
          </div>
        </div>
      </section>
  )
}