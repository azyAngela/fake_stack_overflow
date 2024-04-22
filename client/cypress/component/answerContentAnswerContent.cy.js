import React from 'react'
import AnswerContent from '../../src/components/main/answer/answerContent'
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';
describe('<AnswerContent />', () => {
   const passinganswer= {_id : '1', text : 'text1', upvotes : 5, ans_by : 'lily', ans_date_time: '2021-10-10T00:00:00.000Z'}


  it('renders', () => {
    cy.mount(<UserProvider>
      <MemoryRouter>
            <AnswerContent answer={passinganswer} />
        </MemoryRouter>
        </UserProvider> )
    cy.get('.card-text').should('contain', 'text1')
    cy.get('.vote-count').should('contain', '5')
  })
})