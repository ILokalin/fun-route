import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import NewPointField from 'components/NewPoint';


describe('New point field Component create', () => {
  
  it('render snap', () => {
    const component = rendrer.create(<NewPointField
    
                                        currentCoords = {[0,0]}
                                        placemarkAddress  = {'Тестовая строка'}/>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})

