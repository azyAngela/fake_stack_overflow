import React from 'react'
import fakeStackOverflow from '../../src/components/fakestackoverflow'

describe('<fakeStackOverflow />', () => {
  it('renders', () => {
    cy.mount(<fakeStackOverflow />)
  })

  it('renders questions list',()=>{
    cy.visit("http://localhost:3000");
    cy.contains("Create New Post").click();
  });
})