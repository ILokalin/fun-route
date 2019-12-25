import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import HelpPage from 'components/HelpPage';


describe('HelpPage Component', () => {
  it('render snap', () => {
    const component = rendrer.create(<HelpPage />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})