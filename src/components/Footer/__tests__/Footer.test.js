import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import Footer from 'components/Footer';


describe('unit', () => {
  
  it('render snap', () => {
    const component = rendrer.create(<Footer />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})
