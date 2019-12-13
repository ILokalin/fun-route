import React from 'react';
import ReactDOM from 'react-dom';
import GetStringCoordinates from '../GetStringCoordinates/GetStringCoordinates';


test('Get string with coordinates', () => {
    expect(GetStringCoordinates(55.75581329763145)).toBe('55°45′20″')
    expect(GetStringCoordinates(37.61770735297123)).toBe('37°37′03″')
  })

