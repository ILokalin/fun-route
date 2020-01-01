import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import { BrowserRouter } from 'react-router-dom';
import Header from 'components/Header';


describe('unit', () => {
  
  it('render snap', () => {
    const component = renderer.create(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
      )

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})