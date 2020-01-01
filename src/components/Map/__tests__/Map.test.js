import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import Map from 'components/Map';


describe('unit', () => {
  let isLocationFound = false;
  
  it('render snap with not found location', () => {
    const component = renderer.create(<Map
                                      isLocationFound = {isLocationFound}
                                      />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })

  it('render snap with found location', () => {
    isLocationFound = true;
    const component = renderer.create(<Map
                                      isLocationFound = {isLocationFound}
                                      />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    })


  it('has an div tag with "map" id for yamap', () => {
    const component = ReactTestUtils.renderIntoDocument(<Map/>);
    const div = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'map-region__map');

    expect(div.id = 'map').toBeTruthy();
    });
})
