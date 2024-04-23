import React from 'react'
import SignUp from '../../src/components/main/signUp/index'
import { UserProvider } from '../../src/utlis/userprovider.js'
import { MemoryRouter } from 'react-router-dom';
import { validateSignup } from '../../src/utlis/helper.js';
describe('<SignUp />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', { body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { body: true }).as('checkLogin');  });

  it('renders', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <SignUp/>
        </MemoryRouter>
        </UserProvider>)
        cy.get('h2').contains('Sign Up');
        cy.get('button').contains('Register');

  })

  it('can successfully signup', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <SignUp/>
        </MemoryRouter>
        </UserProvider>)
        ;
      cy.intercept('POST', '**/signup', { statusCode: 200 , body:{username:'test', password:'test', email:'test@gmail.com'}}).as('signup');
      cy.get('#fullName').type('test');
      cy.get('#email').type('test@gmail.com');
      cy.get('#password').type('test');
      cy.get('#confirmPassword').type('test');
      cy.get('button').contains('Register').click();
      cy.wait('@signup').then((interception) => {
        expect(interception.response.body).to.have.property('username', 'test');
      });
      cy.get('.text-primary').contains('User created successfully, redirecting to main page...').should('be.visible');
    })

    it('should pop up error when signup not successfully', () => {
      cy.mount(<UserProvider>
        <MemoryRouter>
              <SignUp/>
          </MemoryRouter>
          </UserProvider>)
          ;
        cy.intercept('POST', '**/signup', { statusCode: 500 , body:{username:'test', password:'test', email:'test@gmail.com'}}).as('signup');
        cy.get('#fullName').type('test');
        cy.get('#email').type('test@gmail.com');
        cy.get('#password').type('test');
        cy.get('#confirmPassword').type('test');
        cy.get('button').contains('Register').click();
        cy.wait('@signup').then((interception) => {
          expect(interception.response.body).to.have.property('username', 'test');
        });
        cy.get('.text-danger').contains('Error signning up').should('be.visible');
      })

      it('validator for all information works', () => {
        it('returns "Invalid email" if the email is not properly formatted', () => {
          const result = validateSignup('example.com', 'password123', 'password123', 'user');
          expect(result).to.eq('Invalid email');
      });
  
      it('returns "Password is required" if the password is missing', () => {
          const result = validateSignup('user@example.com', '', '', 'user');
          expect(result).to.eq('Password is required');
      });
  
      it('returns "Passwords do not match" if password and confirm password do not match', () => {
          const result = validateSignup('user@example.com', 'password123', 'password124', 'user');
          expect(result).to.eq('Passwords do not match');
      });
  
      it('returns "Username must be at least 3 characters" if the username is too short', () => {
          const result = validateSignup('user@example.com', 'password123', 'password123', 'us');
          expect(result).to.eq('Username must be at least 3 characters');
      });
  
      it('returns null if all inputs are valid', () => {
          const result = validateSignup('user@example.com', 'password123', 'password123', 'user');
          expect(result).to.be.null;
      });
        })
      
    
})