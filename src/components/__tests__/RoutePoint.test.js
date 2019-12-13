import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';
import RoutePoint from '../../components/RoutePoint/RoutePoint';

const testObject = {
  name: 'Start test',
  address: 'line start test street', 
  id: 'unique_line_1', 
  coords: [0,0]
  }

describe('Route point create', () => {
  it('render snap', () => {
    const component = rendrer.create(<RoutePoint  point={testObject}
                                                  key={testObject.id}
                                                  pointLetter={'A'}/>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })


})
