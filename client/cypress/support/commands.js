// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.get('button').contains('Login').click();
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('button').contains('Log in').click();
    cy.get('button').contains(username).should('exist');
    cy.get('#searchBar').should('exist');
});


Cypress.Commands.add("createNewQuestion", (title, text, tags) => {
    cy.contains('Create New Post').click();
    cy.get('#title').type(title);
    cy.get('#text').type(text);
    cy.get('#tags').type(tags);
    cy.get('button').contains('Submit').click();
});

Cypress.Commands.add('createNewAnswer', (answerText) => {
    cy.get('a').contains('Create an Answer').click();
    cy.get('#answerText').type(answerText);
    cy.get('button').contains('Create Answer').click();
  });
  

Cypress.Commands.add("testVoteLogic", () => {
    cy.get('button').contains('Upvote').click();
    cy.contains('1').should('exist');
    cy.get('button').contains('Downvote').click();
    cy.contains('1').should('exist');
    cy.get('button').contains('Upvote').click();
    cy.contains('0').should('exist');
    cy.get('button').contains('Downvote').click();
    cy.contains('-1').should('exist');
  });
  
