import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import RouteTypeButton from 'components/RouteTypeButton'


describe('unit', () => {
  it('Route type button', () => {
    const component = renderer.create(<RouteTypeButton />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})
