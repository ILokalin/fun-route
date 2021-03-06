import React from 'react';
import HelpCard from 'components/HelpCard';

import SetNewPointMapImage from 'assets/set-new-point-map.jpg';
import AddNewPointButtonImage from 'assets/add-new-point-button.jpg';
import StartEndPointsInRoutImage from 'assets/start-end-points-in-route.jpg';
import PlacemarkAddressRouteImage from 'assets/placemark-address-route.jpg';
import ButtonsUpDownImage from 'assets/buttons-up-down.jpg';
import RouteTypeButton from 'assets/route-type-button.jpg';
import ButtonRemoveImage from 'assets/button-remove.jpg';

import IconRemove from 'components/IconsBtn/IconRemove';
import IconAdd from 'components/IconsBtn/IconAdd';


export default class extends React.Component {

  render () {

    const helpContent = [
      {
        id: 'help__topic-0001',
        helpTitle: 'Выбор точки',
        helpPictureSrc: SetNewPointMapImage,
        helpText: ["Для начала работы необходимо выбрать место начала ма\u00adршрута на карте и уста\u00adновить маркер. Маркер можно установить пере\u00adтаски\u00adва\u00adнием маркера из центра карты или кликнув в нужной точке ка\u00adрты левой клавишей мыши."]
      }, {
        id: 'help__topic-0002',
        helpTitle: 'Добавление точки',
        helpPictureSrc: AddNewPointButtonImage,
        helpText: ['Адрес отобразится в поле создания новой точки маршрута. В поле можно указать свое название для точки (адрес сохра\u00adнится и будет также указан), уточнить координаты. Для добавления точки необходимо нажать кнопку', <IconAdd />, 'или клавишу Enter в поле для ввода текста.']
      }, {
        id: 'help__topic-0003',
        helpTitle: 'Список маршрута',
        helpPictureSrc: StartEndPointsInRoutImage,
        helpText: ['Добавляя точки, их описание (адрес, название) разме\u00adщаются в списке.  Первые 10 получают литер от A до J. В случае, когда название или адрес не помещаются в ширину отведенного поля, можно получить разве\u00adрнутую информацию о точке маршрута, выделив точку левой кнопкой мыши.']
      }, {
        id: 'help__topic-0004',
        helpTitle: 'Маркеры на карте',
        helpPictureSrc: PlacemarkAddressRouteImage,
        helpText: ['Для каждой точки на карте создается круглый маркер, место\u00adположение соответствует координатам (широта, долгота). Нажав на маркер, откры\u00adвается текущий адрес в соответствии с гео\u00adкодиро\u00adванием сервиса Яндекс-карты. Добавьте начальную и конечную точку маршрута в списке.']
      }, {
        id: 'help__topic-0005',
        helpTitle: 'Изменение последовательности',
        helpPictureSrc: ButtonsUpDownImage,
        helpText: ['Для изменения последовательности маршрута можно пере\u00adта\u00adскивать элементы в списке, размещая их нужном порядке. Также, можно воспользоваться кнопками, которые открываются при наведении указателя мыши на элемент. В мобильной версии кнопки для пере\u00adмещения вверх/вниз открыты всегда, а литеры точек, в списке не указываются.']
      }, {
        id: 'help__topic-0006',
        helpTitle: 'Удаление точки',
        helpPictureSrc: ButtonRemoveImage,
        helpText: ['Удалить точку из маршрута можно нажатием кнопки', <IconRemove />, 'нахо\u00adдя\u00adщейся у каждого элемента в списке. Отменить удаление нево\u00adзможно.']
      }, {
        id: 'help__topic-0007',
        helpTitle: 'Режимы отображения маршрута',
        helpPictureSrc: RouteTypeButton,
        helpText: ['Составленный маршрут можно представить в виде проло\u00adженного пути. Для этого необходимо переключить режим, выбрав “Показать маршрут на карте”. Вернуться в режим редактирования, можно установив переключатель в обра\u00adтное положение.']
      }]

    return (
      <section className="help">
        <h2 className="help__title-page">Описание работы</h2>
        
        <div className="help__rules-container">
          {helpContent.map(helpTopic => <HelpCard 
                                          key = {helpTopic.id}
                                          helpTopic = {helpTopic}
                                        />
          )}
  
        </div>
      </section>
    )
  } 
}
  