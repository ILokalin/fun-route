import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';
import RouteContainer from "../RouteContainer/RouteContainer";


describe('RouteContainer Component', () => {
  const routPoints = [{name: 'Start test', address: 'line start test street', id: 'unique_line_1', coords: [0,0]},
                     {name: 'End test', address: 'line end test street', id: 'unique_line_2', coords: [55,37]}]

  it('render snap', () => {
    const component = rendrer.create(<RouteContainer  routPoints={routPoints} 
                                                      />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })


})