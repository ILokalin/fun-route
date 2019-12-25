import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import RoutePoint from 'components/RoutePoint';

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

describe('Route point create', () => {
  it('render snap', () => {
    const component = rendrer.create(<RoutePoint  point={fakePoint}
                                                  key={fakePoint.id}
                                                  pointLetter={'A'}/>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })


})
