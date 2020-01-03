import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import HelpCard from 'components/HelpCard';


describe('unit', () => {
  const fakeHelpTopic = {
    id: 'test_id_0000',
    helpTitle: 'test title',
    helpPictureSrc: '',
    helpText: ['test text first', 'test text second']
  }
  
  it('render snap', () => {
    const component = renderer.create(<HelpCard 
                                        helpTopic = {fakeHelpTopic}
                                        />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})