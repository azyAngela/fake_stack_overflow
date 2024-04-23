import React from 'react'
import PostDetail from '../../src/components/main/answer/index'
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<PostDetail />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/csrf-token', { body: { csrfToken: 'fake-csrf-token' } }).as('getCsrfToken');
    cy.intercept('GET', '**/check-login', { body: true }).as('checkLogin');  });

  it('renders with no data', () => {
    cy.mount(<PostDetail />)
  })

  it('renders with data', () => {
    const post =   { _id: '1', title: 'Post 1',  upvotes: 5 ,text:'text1', asked_by: "lily", tags:['tag1','tag2']};
    cy.intercept('GET', '**/getquestionbyid/**', { statusCode: 200, body: post}).as('getPosts');

    cy.mount(<UserProvider>
       <BrowserRouter>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </BrowserRouter>
        </UserProvider>)
        cy.window().then((win) => {
          win.history.pushState({}, '', '/posts/123');
        });
      
      
  })
})