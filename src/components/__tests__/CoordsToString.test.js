import React from 'react';
import ReactDOM from 'react-dom';
import CoordsToString from '../CoordsToString/CoordsToString';


test('Get string with coordinates', () => {
    expect(CoordsToString([55.75581329763145, 37.61770735297123])).toBe('55°45′20″  37°37′03″')
  })

