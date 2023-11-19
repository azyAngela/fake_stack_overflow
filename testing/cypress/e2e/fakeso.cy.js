// Template test file. Change the file to add more tests.
describe('Fake SO Test Suite', () => {
    beforeEach(() => {
        // Seed the database before each test
//        cy.exec('node /path/to/server/init.js');
      });

      afterEach(() => {
        // Clear the database after each test
//        cy.exec('node /path/to/server/destroy.js');
      });
    it('successfully shows All Questions string', () => {
        cy.visit('http://localhost:3000');
        cy.contains('All Questions');
    });
    it('successfully shows Ask a Question button', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question');
    });
})