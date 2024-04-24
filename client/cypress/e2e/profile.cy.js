describe('Profile/Login/Signup Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.exec("node ../server/populate.js mongodb://127.0.0.1:27017/fake_so");
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

    cy.get('#searchBar').should('exist');
  });

  it('Error message should show when user credentials are incorrect for log in', () => {
    cy.login('l', '123');
    cy.contains('Log in').click();
    cy.contains('Username or password is incorrect').should('exist');
  });

  it('Error message should show when user sign up with empty username ', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('Username must be at least 3 characters').should('exist');
  });

  it('Error message should show when user sign up with empty email ', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('Invalid email').should('exist');
  });

  it('Error message should show when user sign up with wrong email format(without @) ', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuserexample.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('Invalid email').should('exist');
  });

  it('Error message should show when user sign up with wrong email format(without .) ', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuser@examplecom');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('Invalid email').should('exist');
  });

  it('Error message should show when user sign up with password not matching ', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password1234');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('Passwords do not match').should('exist');
  });

  it('Sign up successfully with message', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('#fullName').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Register').click();
    cy.contains('User created successfully, redirecting to main page...').should('exist');
  });

  it('User can log out', () => {
    cy.login('lily', '123');
    cy.visit('http://localhost:3000/profile');
    cy.contains('Logout').click();
    cy.contains('Login').should('exist');
  });

  it('User can edit their profile', () => {
    cy.login('lily', '123');
    cy.visit('http://localhost:3000/profile');
    cy.contains('Edit Profile').click();
    cy.get('#editUserName').type('newLily');
    cy.get('#editPassword').type('1234');
    cy.get('button').contains('Save Changes').click();
    cy.contains('newLily').should('exist');
    cy.contains('User updated successfully').should('exist');
  });

  it('User can cancel editing their profile', () => {
    cy.login('lily', '123');
    cy.visit('http://localhost:3000/profile');
    cy.contains('Edit Profile').click();
    cy.get('#editUserName').type('newLily');
    cy.get('#editPassword').type('1234');
    cy.get('button').contains('Cancel').click();
    cy.contains('lily').should('exist');
  });

  it('Question activity history contains current user newly added post', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title lily', 'Question text lily', 'tag1 tag2');
    cy.contains('lily').click();
    cy.contains('Question title lily').should('exist');
    cy.contains('Question text lily').should('exist');
    cy.contains('tag1').should('exist');
    cy.contains('tag2').should('exist');
  });

  it('Answer activity history contains current user newly added answer', () => {
    cy.login('lily', '123');
    cy.createNewQuestion('Question title lily', 'Question text lily', 'tag1 tag2');
    cy.contains('Question title lily').click();
    cy.createNewAnswer('Answer text lily');
    cy.contains('lily').click();
    cy.contains('Answer text lily').should('exist');
  });
});
