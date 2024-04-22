describe('Fake Stack Overflow Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    });
    
  })