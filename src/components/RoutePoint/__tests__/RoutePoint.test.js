import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import RoutePoint from 'components/RoutePoint';


describe('unit', () => {
  const fakePoint = {
    name: 'Start test',
    geometry: {
      id: 'unique_line_1',
      getCoordinates: () => {
        return [0,0]
      }
    },
    properties: {
      get: (param) => {
        if (param === 'balloonContent') {
          return 'line start test street';
        } else {
          return 'ERROR! Check parameters "point.properties.get("balloonContent")" for address';
        }
      }
    }
  }  
  
  it('render snap', () => {
    const mockCallback = jest.fn();
    
    const component = renderer.create(<RoutePoint  point={ fakePoint }
                                                  key={ fakePoint.id }
                                                  pointLetter={ 'A' }
                                                  newIndexFind = { mockCallback }
                                                  />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })

  it('render snap', () => {
    const mockCallback = jest.fn();
    
    const component = renderer.create(<RoutePoint  point={ fakePoint }
                                                  key={ fakePoint.id }
                                                  pointLetter={ 'A' }
                                                  newIndexFind = { mockCallback }
                                                  />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })
})
