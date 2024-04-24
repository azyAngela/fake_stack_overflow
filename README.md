[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View posts | User can view all posts on the home page, clicking on a specific post will goes to the post detail page to view/delete/edit post detail and see all its associated answers. | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/viewPosts.cy.js | path/to/test    | path/to/test   |
| Create new posts | User can create a new post to the platform, with question title, text, and tags. | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/createNewPosts.cy.js | path/to/test    | path/to/test   |
| Search for existing posts | User can search for existing posts by entering keywords or tags, or combination of keywords and tags. | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/search.cy.js | path/to/test    | path/to/test   |
| Commenting on posts | User can create a comment on existing posts with text under specific post detail page.   | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/commentOnPosts.cy.js | path/to/test    | path/to/test   |
| Voting on posts | User can upvote or downvote posts on home page, they can also vote posts on post detail page, and also can vote on answers.  | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/voting.cy.js | path/to/test    | path/to/test   |
| Tagging posts | User can give tags to questions when creating a new question, and the tags will be displayed anywhere in the platform under the question, user can also search by tags. | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/tags.cy.js | path/to/test    | path/to/test   |
| User Profiles | Every user can view their profile after they log in, in the profile there are information of username, email, reputation, question activity history, and answer activity history. | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/profile.cy.js| path/to/test    | path/to/test   |
| Post moderation | The posts and answers should be monitered through authentication of user log in, there should have limited access to edit or delete posts and answers based on user roles, admin has more rights.  | /Users/angelaan/Desktop/5500-foundations/final-project-dingbang-ziyi/client/cypress/e2e/postModeration.cy.js | path/to/test    | path/to/test   |

## Instructions to generate and view coverage report 
Instructions: 
1. navigate to client by running:
    cd client/
2. run the code: 
    npx nyc cypress run --browser chrome
3. run the code:
    npx nyc report --reporter=text-summary


=============================== Coverage summary ===============================
Statements   : 87.63% ( 567/647 )
Branches     : 82.8% ( 183/221 )
Functions    : 97.43% ( 152/156 )
Lines        : 87.51% ( 554/633 )

----------------------------------------|---------|----------|---------|---------|---------------------------------------------------------------------
File                                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                   
----------------------------------------|---------|----------|---------|---------|---------------------------------------------------------------------
All files                               |   87.63 |     82.8 |   97.43 |   87.51 |                                                                     
 client                                 |     100 |      100 |     100 |     100 |                                                                     
  cypress.config.js                     |     100 |      100 |     100 |     100 |                                                                     
 client/src                             |     100 |      100 |     100 |     100 |                                                                     
  App.js                                |     100 |      100 |     100 |     100 |                                                                     
  index.js                              |     100 |      100 |     100 |     100 |                                                                     
 client/src/components                  |     100 |      100 |     100 |     100 |                                                                     
  fakestackoverflow.js                  |     100 |      100 |     100 |     100 |                                                                     
 client/src/components/header           |   94.44 |      100 |    87.5 |   94.44 |                                                                     
  index.js                              |   94.44 |      100 |    87.5 |   94.44 | 24                                                                  
 client/src/components/main             |     100 |      100 |     100 |     100 |                                                                     
  index.js                              |     100 |      100 |     100 |     100 |                                                                     
 client/src/components/main/answer      |   87.28 |    78.57 |   97.87 |   86.66 |                                                                     
  answerContent.js                      |   90.47 |    76.47 |     100 |   90.47 | 18-21                                                               
  index.js                              |   86.36 |    77.58 |   96.66 |   85.48 | 32,49,67-68,111-112,142,173-174,185-186,202,207-208,223-224,236-237 
  postContent.js                        |      90 |     82.6 |     100 |      90 | 16-19                                                               
 client/src/components/main/login       |   96.77 |      100 |     100 |   96.66 |                                                                     
  index.js                              |   96.77 |      100 |     100 |   96.66 | 23                                                                  
 client/src/components/main/newAnswer   |   95.83 |    66.66 |     100 |   95.83 |                                                                     
  index.js                              |   95.83 |    66.66 |     100 |   95.83 | 22                                                                  
 client/src/components/main/newQuestion |   93.18 |    92.85 |     100 |   93.18 |                                                                     
  index.js                              |   93.18 |    92.85 |     100 |   93.18 | 26,87-88                                                            
 client/src/components/main/profile     |   89.36 |    88.88 |     100 |   89.36 |                                                                     
  index.js                              |   89.36 |    88.88 |     100 |   89.36 | 24,39-40,53,64                                                      
 client/src/components/main/question    |   91.04 |    76.47 |     100 |    90.9 |                                                                     
  index.js                              |   92.72 |       80 |     100 |   92.59 | 21,38,62-63                                                         
  postItem.js                           |   83.33 |       50 |     100 |   83.33 | 12-15                                                               
 client/src/components/main/services    |   71.18 |      100 |     100 |   71.18 |                                                                     
  answer.js                             |   74.19 |      100 |     100 |   74.19 | 39-40,58-59,77-78,95-96                                             
  checkLoginStatus.js                   |   71.42 |      100 |     100 |   71.42 | 13-14                                                               
  profile.js                            |   72.97 |      100 |     100 |   72.97 | 15-16,25-26,40-41,70-71,85-86                                       
  question.js                           |   67.44 |      100 |     100 |   67.44 | 10-11,29-30,49-50,59-60,78-79,97-98,115-116                         
 client/src/components/main/signUp      |   91.48 |      100 |   81.81 |   93.47 |                                                                     
  index.js                              |   91.48 |      100 |   81.81 |   93.47 | 23,69-72                                                            
 client/src/utlis                       |   95.23 |    88.57 |     100 |      95 |                                                                     
  dateFormat.js                         |   88.88 |       80 |     100 |   88.88 | 13,15                                                               
  helper.js                             |   96.42 |    95.23 |     100 |   96.15 | 46                                                                  
  userprovider.js                       |     100 |       75 |     100 |     100 | 16                                                                  
----------------------------------------|---------|----------|---------|---------|---------------------------------------------------------------------
## Extra Credit Section (if applicable)