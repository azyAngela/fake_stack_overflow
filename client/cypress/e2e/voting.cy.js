describe('Fake Stack Overflow Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('voting logic should work on main page', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.testVoteLogic();
  });


  it('voting logic should work on post detail page for voting the post', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.contains('Question title 1').click();
    cy.get('.card-body2').eq(0).find('button').contains('Upvote').click();
    cy.contains('.mx-2', '1').should('exist');
    cy.get('.card-body2').eq(0).find('button').contains('Downvote').click();
    cy.contains('.mx-2', '1').should('exist');
    cy.get('.card-body2').eq(0).find('button').contains('Upvote').click();
    cy.contains('.mx-2', '0').should('exist');
    cy.get('.card-body2').eq(0).find('button').contains('Downvote').click();
    cy.contains('.mx-2', '-1').should('exist');
  });

  it('voting logic should work on post detail page for voting the answer', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.contains('Question title 1').click();
    cy.createNewAnswer('There is a new answer for pig');
    cy.get('.card-body').eq(0).find('button').contains('Upvote').click();
    cy.contains('.vote-count', '1').should('exist');
    cy.get('.card-body').eq(0).find('button').contains('Downvote').click();
    cy.contains('.vote-count', '1').should('exist');
    cy.get('.card-body').eq(0).find('button').contains('Upvote').click();
    cy.contains('.vote-count', '0').should('exist');
    cy.get('.card-body').eq(0).find('button').contains('Downvote').click();
    cy.contains('.vote-count', '-1').should('exist');
  });
})