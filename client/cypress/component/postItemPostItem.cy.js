import React from 'react'
import PostItem from '../../src/components/main/question/postItem.js'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<PostItem />', () => {
  const post ={title: "How do I create a JSON object in MongoDB?",
  text: "I'm new to MongoDB and I need to know how to create a JSON object based on a given schema. Can anyone help?",
  asked_by: "user123",
  ask_date_time: "2024-04-15T14:52:30.000Z",
  tags: [
    "react","dd"
  ]}
  it('renders', () => {
    
    cy.mount(<UserProvider>
      <MemoryRouter>
        <PostItem post={post} />
        </MemoryRouter>
        </UserProvider>)
      cy.contains(post.title).should('be.visible');
      cy.contains(post.text).should('be.visible');
      cy.contains(post.asked_by).should('be.visible');
      cy.contains("asked Apr 15 at 10:52:30").should('be.visible');
  })
})