describe('Fake Stack Overflow Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });

    afterEach(() => {
        cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    });

    it('the tags should be added when creating a question', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
        cy.contains('cat').should('exist');
        cy.contains('dog').should('exist');
    });

    it('the tags should be added when creating a question2', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'tag111 tag222 tag333');
        cy.contains('tag111').should('exist');
        cy.contains('tag222').should('exist');
        cy.contains('tag333').should('exist');
    });

    it('the tags should be shown in the post detail page', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'tag111 tag222 tag333');
        cy.contains('Question title 1').click();
        cy.contains('tag111').should('exist');
        cy.contains('tag222').should('exist');
        cy.contains('tag333').should('exist');
    });


})