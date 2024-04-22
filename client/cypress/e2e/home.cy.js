describe('Fake Stack Overflow Tests', () => {
  beforeEach(() => {
    // Assuming your app runs on localhost:3000
    cy.visit('http://localhost:3000');
  });

  it('allows users to sign up', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    setTimeout(() => {
      cy.get('profilebutton').contains('newuser')
    }, 3000);
  });

  it('allows users to log in', () => {
    cy.get('button').contains('Login').click();
    cy.get('#username').type('lily');
    cy.get('#password').type('123');
    cy.get('button').contains('Log in').click();
    setTimeout(() => {
      cy.get('profilebutton').contains('lily')
    }, 3000);  });

})