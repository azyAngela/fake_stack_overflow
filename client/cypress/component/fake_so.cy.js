import React from 'react'
import fakeStackOverflow from '../../src/components/fakestackoverflow'

describe('<fakeStackOverflow />', () => {
  it('renders', () => {
    cy.mount(<fakeStackOverflow />)
  })
})