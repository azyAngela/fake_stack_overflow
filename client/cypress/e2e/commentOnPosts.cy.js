describe('Fake Stack Overflow Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });

    afterEach(() => {
        cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    });

    it('user can create an answer and edit their own posted answer', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
        cy.contains('Question title 1').click();

        cy.createNewAnswer('There is a new answer for pig');

        // Times stamp testing 
        cy.contains('There is a new answer for pig').should('exist');
        cy.contains("answered 0 seconds ago");
        cy.contains("answered by lily");

        cy.get('button').contains('Edit Answer').click();
        cy.get('#edit-textareaAnswer').type(' edited');
        cy.get('button').contains('Save').click();
        cy.contains('There is a new answer for pig edited').should('exist');

    });

    it('no "Create an Answer" button when not logged in', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Programmatically navigate using React router').should('exist');
        cy.get('button').contains('Create an Answer').should('not.exist');
    });

    it('user cannot edit others answers, but can edit their own answer', () => {
        cy.login('lily', '123');
        cy.contains('Programmatically navigate using React router').click();
        cy.createNewAnswer('There is a new answer for tiger');

        cy.get('.card-body').each(($answer) => {
            const username = $answer.find('.col-md-6').text();
            if (username.includes('answered by lily')) {
                cy.wrap($answer).find('button').contains('Edit Answer').should('exist');
            } else {
                cy.wrap($answer).find('button').contains('Edit Answer').should('not.exist');
            }
        });
    });

});