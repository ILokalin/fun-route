import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

import ErrorPage from 'components/ErrorPage';


describe('ErrorPage Component', () => {
  it('render snap', () => {
    const component = rendrer.create(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
      );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})
