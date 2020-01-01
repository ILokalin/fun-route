import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import NewPoint from 'components/NewPoint';


describe('unit', () => {
  const testPoint = {
    placemarkAddress: "Тестовая строка",
    currentCoords: [0,0],
    onAddPoint: (test) => test,
    isLocationFound: false,
  }

  it('render snap when disabled', () => {
    const component = renderer.create(<NewPoint
                                        currentCoords = {testPoint.currentCoords}
                                        placemarkAddress  = {testPoint.placemarkAddress}
                                        onAddPoint = {testPoint.onAddPoint}
                                        isLocationFound = {testPoint.isLocationFound}
                                        />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })
  
  it('render snap when enabled', () => {
    testPoint.isLocationFound = true;

    const component = renderer.create(<NewPoint
                                        currentCoords = {testPoint.currentCoords}
                                        placemarkAddress  = {testPoint.placemarkAddress}
                                        onAddPoint = {testPoint.onAddPoint}
                                        isLocationFound = {testPoint.isLocationFound}
                                        />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })
})

