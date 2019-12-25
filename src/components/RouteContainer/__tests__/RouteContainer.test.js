import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import RouteContainer from 'components/RouteContainer';


describe('RouteContainer Component', () => {
  const routePoints = [{
    name: 'fake name for test',
    geometry: {
      id: 'fake_id_00000',
      getCoordinates: () => {
        return [55,37]
      }
    },
    properties: {
      get: (param) => {
        if (param === 'balloonContent') {
          return 'fake address for test 0001';
        } else {
          return 'ERROR! Check parameters "point.properties.get("balloonContent")" for address';
        }
      }
    }
  },
  {
    name: 'fake name for test',
    geometry: {
      id: 'fake_id_00001',
      getCoordinates: () => {
        return [58,58]
      }
    },
    properties: {
      get: (param) => {
        if (param === 'balloonContent') {
          return 'fake address for test 0002';
        } else {
          return 'ERROR! Check parameters "point.properties.get("balloonContent")" for address';
        }
      }
    }
  }]

  it('render snap', () => {
    const component = rendrer.create(<RouteContainer  routePoints={routePoints} 
                                                      />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })


})