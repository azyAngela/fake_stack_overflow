import React from 'react'
import FakeStackOverflow from '../../src/components/fakestackoverflow'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<fakeStackOverflow />', () => {
  it('renders', () => {
    cy.mount(
    
      <UserProvider>
      <MemoryRouter>
    <FakeStackOverflow />
    </MemoryRouter>
    </UserProvider>)
    cy.get('.title').should('contain', 'Fake Stack Overflow')
  })
})