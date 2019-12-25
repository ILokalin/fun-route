import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import rendrer from 'react-test-renderer';

import HelpCard from 'components/HelpCard';

const fakeHelpTopic = {
  id: 'test_id_0000',
  title: 'test title',
  image: '',
  text: ['test text first', 'test text second']
}

describe('New point field Component create', () => {
  
  it('render snap', () => {
    const component = rendrer.create(<HelpCard 
                                        helpTopic = {fakeHelpTopic}
                                        />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    })
})