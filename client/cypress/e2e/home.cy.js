describe('Fake Stack Overflow Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('allows users to sign up', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.get('button').contains('newuser').should('exist');
  });

  it('allows user to log in', () => {
    cy.login('lily', '123');
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

    // Vote logic testing
    cy.testVoteLogic();
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

  it('click on the post title goes to the post detail page', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title 1', 'Question text 1', 'cat dog');

    // Click on the post title
    cy.contains('Question title 1').click();
    cy.contains('Question title 1').should('exist');
    cy.contains('Question text 1').should('exist');
    cy.contains('cat').should('exist');
    cy.contains('dog').should('exist');
    cy.contains('0').should('exist');
    cy.testVoteLogic();
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

  it('no "Create New Post" button when not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('a').contains('Create New Post').should('not.exist');
  });

  it('no "Create an Answer" button when not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Programmatically navigate using React router').click();
    cy.contains('Programmatically navigate using React router').should('exist');
    cy.get('button').contains('Create an Answer').should('not.exist');
  });

  it('user cannot edit others posts, but can edit their own post', () => {
    cy.login('lily', '123');
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button').contains('Edit').should('not.exist');
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

})