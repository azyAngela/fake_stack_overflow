describe('Fake Stack Overflow Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });

    afterEach(() => {
        cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    });


    it('user can create a new post', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 1');
        cy.get('#text').type('Question text 1');
        cy.get('#tags').type('cat dog');
        cy.get('button').contains('Submit').click();

        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 2');
        cy.get('#text').type('Question text 2');
        cy.get('#tags').type('html css cat');
        cy.get('button').contains('Submit').click();
    });

    it('post is created successfully and displayed on the main page', () => {
        cy.login('lily', '123');
        cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
        cy.contains('All Posts').should('exist');
        cy.contains('Question title 1').should('exist');
        cy.contains('Question text 1').should('exist');
        cy.contains('cat').should('exist');
        cy.contains('dog').should('exist');
        cy.contains('0').should('exist');

        // Times stamp testing 
        cy.contains("asked 0 seconds ago");
        cy.contains("asked by: lily");
    });

    it('Error message shown for empty question text when creating new question', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 3');
        cy.get('button').contains('Submit').click();
        cy.contains('Question text is required').should('exist');
    });

    it('Error message shown for empty question title when creating new question', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#text').type('Question text 3');
        cy.get('#tags').type('html css cat');
        cy.get('button').contains('Submit').click();
        cy.contains('Question title is required').should('exist');
    });
    it('Error message shown for empty tags when creating new question', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 3');
        cy.get('#text').type('Question text 3');
        cy.get('button').contains('Submit').click();
        cy.contains('Tags should not be empty').should('exist');
    });

    it('Error message shown for too long question title when creating new question', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 3ccccccQuestion title 3ccccccQuestion title 3ccccccQuestion title 3cccccc');
        cy.get('#text').type('Question text 3');
        cy.get('#tags').type('html css cat');
        cy.get('button').contains('Submit').click();
        cy.contains('Question title cannot be longer than 50 characters').should('exist');
    });

    it('Error message shown for too short question text when creating new question', () => {
        cy.login('lily', '123');
        cy.contains('Create New Post').click();
        cy.get('#title').type('Question title 3');
        cy.get('#text').type('Ques');
        cy.get('#tags').type('html css cat');
        cy.get('button').contains('Submit').click();
        cy.contains('Question text must be at least 10 characters long').should('exist');
    });

    it('no "Create New Post" button when not logged in', () => {
        cy.visit('http://localhost:3000');
        cy.get('a').contains('Create New Post').should('not.exist');
      });

});