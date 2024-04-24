[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View posts | User can view all posts on the home page, clicking on a specific post will goes to the post detail page to view/delete/edit post detail and see all its associated answers. | client/cypress/e2e/viewPosts.cy.js | client/cypress/component/indexPostList.cy.js, client/cypress/component/indexPostDetail.cy.js   | server/tests/question.test.js   |
| Create new posts | User can create a new post to the platform, with question title, text, and tags. | client/cypress/e2e/createNewPosts.cy.js |  client/cypress/component/indexCreatePost.cy.js   | server/tests/question.test.js    |
| Search for existing posts | User can search for existing posts by entering keywords or tags, or combination of keywords and tags. | client/cypress/e2e/search.cy.js | client/cypress/component/header.cy.js   | server/tests/question.test.js    |
| Commenting on posts | User can create a comment on existing posts with text under specific post detail page.   | client/cypress/e2e/commentOnPosts.cy.js | client/cypress/indexNewAnswer.cy.js    | server/tests/newAnswer.test.js   |
| Voting on posts | User can upvote or downvote posts on home page, they can also vote posts on post detail page, and also can vote on answers.  | client/cypress/e2e/voting.cy.js |  client/cypress/component/indexPostList.cy.js, client/cypress/component/indexPostDetail.cy.js   | server/tests/question.test.js    |
| Tagging posts | User can give tags to questions when creating a new question, and the tags will be displayed anywhere in the platform under the question, user can also search by tags. | client/cypress/e2e/tags.cy.js | client/cypress/component/indexCreatePost.cy.js    | server/tests/tags.test.js   |
| User Profiles | Every user can view their profile after they log in, in the profile there are information of username, email, reputation, question activity history, and answer activity history. | client/cypress/e2e/profile.cy.js| client/cypress/component/indexProfilePage.cy.js   |  |
| Post moderation | The posts and answers should be monitered through authentication of user log in, there should have limited access to edit or delete posts and answers based on user roles, admin has more rights.  | client/cypress/e2e/postModeration.cy.js | client/cypress/component/indexPostDetail.cy.js,  client/cypress/component/postItemPostItem.cy.js  | server/tests/question.test.js   |

## Instructions to generate and view coverage report 

## Extra Credit Section (if applicable)
We ran the codeql to get vulnerability reports. We get the report that we have serveral places that may have vulnerability of sql-injection, e.g controller/answer.js. We have added validator to make sure sql-injection will not happen. In addition, many of endpoints who are interacting with the database need setting rate-limit. We have also fix that e.g controller/question.js and controller answer.js. We have defintly fix more than 4 vulnerabilities.