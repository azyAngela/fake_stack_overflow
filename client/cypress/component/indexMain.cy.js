import React from 'react'
import Main from '../../src/components/main/index'
import { MemoryRouter } from 'react-router-dom';
describe('<Main />', () => {
  it('renders', () => {
    const searchQuery = '';
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MemoryRouter><Main search = {searchQuery}/></MemoryRouter>)
  })
})