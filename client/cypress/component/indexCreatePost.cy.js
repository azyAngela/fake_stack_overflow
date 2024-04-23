import React from 'react'
import CreatePost from '../../src/components/main/newQuestion/index'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<CreatePost />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', {statusCode: 200, body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { statusCode: 200 , body: true }).as('checkLogin');  });

  it('renders', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <CreatePost/>
        </MemoryRouter>
        </UserProvider>)
  })

  it('can successfully create post', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <CreatePost/>
        </MemoryRouter>
        </UserProvider>)
        ;
      cy.intercept('POST', '/api/addQuestion', { statusCode: 200 , body:{text:'test', uid:'test'}}).as('createpost');
      cy.get('#text').type('testasdfasdfasdf');
      cy.get('#title').type('test');
      cy.get('#tags').type('test');
      cy.get('button').contains('Submit').click();

  });
})