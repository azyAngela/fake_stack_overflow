import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PostList from '../../src/components/main/question/index';
describe('<PostList />', () => {
  const posts = [
    { _id: '1', title: 'Post 1',  upvotes: 5 ,text:'text1', asked_by: "lily", tags:['tag1','tag2']},
    { _id: '2', title: 'Post 2', upvotes: 10 , text:'text2', asked_by: "lucy  ", tags:['tag1','tag2']},
  ];
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', { body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { body: true }).as('checkLogin');  });
  it('displays posts correctly', () => {
   
    const searchStr = '';
    cy.intercept('GET', '**/getQuestion', { body: posts }).as('getPosts');
    cy.mount(
      <Router>
        <PostList search={searchStr} />
      </Router>
    );

    cy.contains('All Posts').should('be.visible');
    cy.get('h2').contains('All Posts');
    posts.forEach(post => {
      cy.contains(post.title).should('be.visible');
    });
  });
  it('displays error message when failed to load posts', () => {
    const searchStr = '';
    cy.intercept('GET', '**/getQuestion', { statusCode: 500 }).as('getPosts');
    cy.mount(
      <Router>
        <PostList search={searchStr} />
      </Router>
    );

    cy.contains('Error fetching question:').should('be.visible');
  });
})