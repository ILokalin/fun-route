import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';
import NewPointField from "../NewPointField/NewPointField"
// import faker from 'faker';
// import puppeteer from 'puppeteer';




describe('New point field Component create', () => {
  
// function test() {
//   return true
// }

  it('render snap', () => {
    const component = rendrer.create(<NewPointField
    
                                        placemarkCoord = {[0,0]}
                                        placemarkAddress  = {'Тестовая строка'}/>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})

