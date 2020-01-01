import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import HelpPage from 'components/HelpPage';


describe('unit', () => {
  it('render snap', () => {
    const component = renderer.create(<HelpPage />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})