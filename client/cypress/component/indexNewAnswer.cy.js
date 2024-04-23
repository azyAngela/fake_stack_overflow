import React from 'react'
import NewAnswer from '../../src/components/main/newAnswer/index'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<NewAnswer />', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/csrf-token', { body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
      cy.intercept('GET', '**/check-login', { body: true }).as('checkLogin');  });
  
    it('renders', () => {
      cy.mount(<UserProvider>
        <MemoryRouter>
              <NewAnswer/>
          </MemoryRouter>
          </UserProvider>)
          
          cy.get('button').contains('Create Answer');
  
    })

    it('can successfully create answer', () => {
      cy.mount(<UserProvider>
        <MemoryRouter>
              <NewAnswer/>
          </MemoryRouter>
          </UserProvider>)
          ;
        cy.intercept('POST', '**/addAnswer', { statusCode: 200 , body:{text:'test', qid:'test', uid:"test"}}).as('createanswer');
        cy.get('#answerText').type('test');
        cy.get('button').contains('Create Answer').click();
        cy.wait('@createanswer').then((interception) => {
          expect(interception.response.body).to.have.property('text', 'test');
        });
      
    });
})