describe('Profile/Login/Signup Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.exec("node ../server/populate.js mongodb://localhost:27017/fake_so");
    });
  
    afterEach(() => {
      cy.exec("node ../server/destroy.js mongodb://localhost:27017/fake_so");
    });


  it('search by tag: [cat]', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.createNewQuestion('Question title 2', 'Question text 2', 'html css cat');
    cy.get('#searchBar').type('[cat]{enter}');
    const qTitles = ["Question title 1", "Question title 2"];
    cy.get('.card-title').each(($el, index) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  });

  it('search by title: studio', () => {
    cy.login('lily', '123');
    cy.get('#searchBar').clear().type('studio{enter}');
    cy.get('.card-title').should('contain', 'android studio save string shared preference, start activity and load the saved string');
  });

  it('search by multiple tags: [cat] [html]', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.createNewQuestion('Question title 2', 'Question text 2', 'html css cat');
    cy.get('#searchBar').clear().type('[cat] [html]{enter}');
    cy.get('.card-title').should('contain', 'Question title 1', 'Question title 2');
  });

  it('search by text: calculate', () => {
    cy.login('lily', '123');
    cy.get('#searchBar').clear().type('calculate{enter}');
    cy.get('.card-text').should('contain', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.');
  });

  it('search by tag and title combination: [cat] studio', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');
    cy.createNewQuestion('Question title 2', 'Question text 2', 'html css cat');
    cy.get('#searchBar').clear().type('[cat] studio{enter}');
    cy.get('.card-title').should('contain', 'android studio save string shared preference, start activity and load the saved string', 'Question title 2', 'Question title 1');
  });

});