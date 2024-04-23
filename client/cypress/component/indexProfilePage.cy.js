import React from 'react'
import ProfilePage from '../../src/components/main/profile/index'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<ProfilePage />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', { statusCode:200, body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { statusCode:200, body: true }).as('checkLogin');  });

  it('renders', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <ProfilePage/>
        </MemoryRouter>
        </UserProvider> )
  })
})