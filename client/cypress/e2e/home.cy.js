describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
  it('renders questions list',()=>{
    cy.visit("http://localhost:3000");
    cy.contains("Create New Post").click();
  });
})