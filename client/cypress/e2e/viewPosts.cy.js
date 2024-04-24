describe('Fake Stack Overflow Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.exec("node ../server/populate.js mongodb://localhost:27017/fake_so");
    });

    afterEach(() => {
        cy.exec("node ../server/destroy.js mongodb://localhost:27017/fake_so");
    });

    it('click on the post title goes to the post detail page and display the post information', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');

        // Click on the post title
        cy.contains('Question title 1').click();
        cy.contains('Question title 1').should('exist');
        cy.contains('Question text 1').should('exist');
        cy.contains('cat').should('exist');
        cy.contains('dog').should('exist');
        cy.contains('0').should('exist');
    });

    it('user can edit the post if it is their post', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
        cy.contains('Question title 1').click();

        // Cancel edit 
        cy.get('button').contains('Edit').click();
        cy.get('#edit-textarea').type(' edited');
        cy.get('button').contains('Cancel').click();
        cy.contains('Question text 1').should('exist');

        // Save edit
        cy.get('button').contains('Edit').click();
        cy.get('#edit-textarea').type(' edited');
        cy.get('button').contains('Save').click();
        cy.contains('Question text 1 edited').should('exist');

        // First clear input box then save edit
        cy.get('button').contains('Edit').click();
        cy.get('#edit-textarea').clear().type('This is a edited text content');
        cy.get('button').contains('Save').click();
        cy.contains('This is a edited text content').should('exist');
    });

    it('user can delete their own post', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
        cy.contains('Question title 1').click();
        cy.get('button').contains('Delete').click();
        cy.contains('Question title 1').should('not.exist');
    });

    it('user cannot edit others posts, but can edit their own post', () => {
        cy.login('lily', '123');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('button').contains('Edit').should('not.exist');
    });
});