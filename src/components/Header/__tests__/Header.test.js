import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import { BrowserRouter } from 'react-router-dom';
import Header from "components/Header";


describe('Header component create', () => {
  
  it('render snap', () => {
    const component = rendrer.create(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
      )

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})