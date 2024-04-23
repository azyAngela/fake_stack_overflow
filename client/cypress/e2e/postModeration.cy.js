describe('Fake Stack Overflow Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('no "Create an Answer" button when not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Programmatically navigate using React router').click();
    cy.contains('Programmatically navigate using React router').should('exist');
    cy.get('button').contains('Create an Answer').should('not.exist');
  });

  it('no "Create New Post" button when not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Create New Post').should('not.exist');
  });

  it('logged in user can edit or delete their own post', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.contains('Question title 1').click();
    cy.get('button').contains('Edit').should('exist');
    cy.get('button').contains('Delete').should('exist');
  });

  it('logged in user cannot edit or delete others post', () => {
    cy.login('lily', '123');
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button').contains('Edit').should('not.exist');
    cy.get('button').contains('Delete').should('not.exist');
  });

  it('logged in user can edit or delete their own answer, but not others', () => {
    cy.login('lily', '123');
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button').contains('Edit').should('not.exist');
    cy.get('button').contains('Delete').should('not.exist');
    cy.createNewAnswer('There is a new answer for pig');
    cy.get('button').contains('Edit Answer').should('exist');
    cy.get('button').contains('Delete').should('exist');
  });

  it('admin user will be able to edit and delete all posts and answers', () => {
    cy.login('ADMIN', 'ADMIN');
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button').contains('Edit').should('exist');
    cy.get('button').contains('Delete').should('exist');
    cy.createNewAnswer('There is a new answer for pig');

    cy.get('.card-body').each(($answer) => {
      cy.wrap($answer).find('button').contains('Edit Answer').should('exist');
      cy.wrap($answer).find('button').contains('Delete Answer').should('exist');
    });
  });

})