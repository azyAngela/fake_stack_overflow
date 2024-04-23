import React from 'react'
import Login from '../../src/components/main/login/index'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<Login />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', { body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { body: true }).as('checkLogin');  });

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Login/>
        </MemoryRouter>
        </UserProvider>)

      cy.get('button').contains('Log in');
  })
  it('can successfully login', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Login/>
        </MemoryRouter>
        </UserProvider>)
    cy.intercept('POST', '**/login', { statusCode: 200, body:{username:'test', password:'test', email:'test@gmail.com'} }).as('checkLogin')  
      cy.get('#username').type('test');
      cy.get('#password').type('test');
      cy.get('button').contains('Log in').click();
      cy.get('.text-primary').contains('User loggedin successfully, redirecting to main page...').should('be.visible');
  });
  it('can show error when login fails', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Login/>
        </MemoryRouter>
        </UserProvider>)
    cy.intercept('POST', '**/login', { statusCode: 500, body:{username:'test', password:'test', email:'test@gmail.com'} }).as('checkLogin')  
      cy.get('#username').type('test');
      cy.get('#password').type('test');
      cy.get('button').contains('Log in').click();
      cy.get('.text-danger').contains('Error logging in:').should('be.visible');
  });


})