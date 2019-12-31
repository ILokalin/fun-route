import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import NewPoint from 'components/NewPoint';

const testPoint = {
  placemarkAddress: "Тестовая строка",
  currentCoords: [0,0],
  onAddPoint: (test) => test,
  isLocationFound: false,
}

describe('unit', () => {
  it('render snap when disabled', () => {
    const component = rendrer.create(<NewPoint
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

    const component = rendrer.create(<NewPoint
                                        currentCoords = {testPoint.currentCoords}
                                        placemarkAddress  = {testPoint.placemarkAddress}
                                        onAddPoint = {testPoint.onAddPoint}
                                        isLocationFound = {testPoint.isLocationFound}
                                        />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })
})

