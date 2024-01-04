[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in _images/_

## Instructions to setup and run project

Detailed instructions with all relevant commands go here.

## Team Member 1 Contribution - Ganavi Jayaram

#### Create Account

#### Login

#### Logout

#### Home for Guest User

#### Searching

#### User Profile

#### Design

#### Testing

#### Bug Fixes

## Team Member 2 Contribution - Haonan

#### All Tags

#### New Question

#### Answers

#### Comments

#### New Answer

#### User Profile

#### Design

#### Testing

#### Bug Fixes

## How to run

run client:

```
cd ./client
npm install
npm run start
```

run server

```
cd ./server
npm install
node init.js
node server.js
```

run tests

```
cd ./testing
npm install
npx cypress open
```

## Test cases

| Use-case Name                  | Test case Name                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Create Account                 | allows a new user to register with valid credentials                           |
|                                | does not allow registration with an existing username                          |
|                                | does not allow registration with an existing email                             |
|                                | does not allow password to contain username or email                           |
|                                | validates email format                                                         |
|                                | allows a registered user to login with correct credentials                     |
|                                | does not allow login with incorrect password                                   |
|                                | does not allow login with incorrect username                                   |
|                                | shows error message when username is empty                                     |
|                                | shows error message when password is empty                                     |
|                                | allows a registered user to successfully log out                               |
| Home Page for Guest User       | displays the list of questions                                                 |
|                                | displays the correct information for each question if present                  |
|                                | contains a functional search bar                                               |
|                                | can filter questions in Newest order                                           |
|                                | can filter questions in Active order                                           |
|                                | can filter questions in Unanswered order                                       |
|                                | displays only 5 questions at a time                                            |
|                                | shows the question count correctly                                             |
| Home Page for Registered User  | can ask a question                                                             |
|                                | shows the question count correctly                                             |
|                                | displays the list of questions                                                 |
|                                | displays the correct information for each question if present                  |
|                                | contains a functional search bar                                               |
|                                | can filter questions in Newest order                                           |
|                                | can filter questions in Active order                                           |
|                                | can filter questions in Unanswered order                                       |
|                                | displays only 5 questions at a time                                            |
| Search                         | should allow users to search for questions and display results in Newest order |
| Tags                           | displays all tags from the database and navigates correctly when clicked       |
| New Question                   | allows a registered user with good repuation to post a new question            |
|                                | allows a registered user without good repuation cannot post a new question     |
| Answers for Guest User         | shows question details                                                         |
|                                | shows answers                                                                  |
| Answer for Registered User     | shows question details                                                         |
|                                | shows answers                                                                  |
|                                | Has Answer Question Button                                                     |
|                                | Upvote the Question                                                            |
|                                | Cant upvote the question with reputation less than 50                          |
|                                | Downvote the Question                                                          |
|                                | Cant downvote the Question with reputation less than 50                        |
|                                | allows a user to upvote an answer                                              |
|                                | not allow a user to upvote an answer                                           |
|                                | allows a user to downvote an answer                                            |
|                                | not allows a user to downvote an answer                                        |
|                                | cant accept answer with other users                                            |
|                                | accept answer                                                                  |
| Comments for Guest User        | displays comments for question body                                            |
|                                | displays comments for answers                                                  |
|                                | displays comments for question body with detaills                              |
|                                | displays comments for answers with details                                     |
|                                | next and prev buttons for the comments with more than 3 comments for Question  |
|                                | next and prev buttons for the comments with more than 3 comments for Answer    |
| Comments for Registered user   | displays comments for question body                                            |
|                                | displays comments for answers                                                  |
|                                | displays comments for question body with detaills                              |
|                                | displays comments for answers with details                                     |
|                                | next and prev buttons for the comments with more than 3 comments for Question  |
|                                | next and prev buttons for the comments with more than 3 comments for Answer    |
|                                | Upvote the Comment in the Question                                             |
|                                | Upvote the Comment in the Answer                                               |
|                                | Add comment to the answer                                                      |
|                                | Add comment to the Question                                                    |
| New answer for Registered User | allows a user to answer a question                                             |
| User profile userinfo          | check user basic info                                                          |
|                                | check user info                                                                |
|                                | change user info with used username                                            |
|                                | change user info with used email                                               |
|                                | change user info                                                               |
| User Profile posted questions  | check user posted questions                                                    |
|                                | edit question                                                                  |
|                                | delete question                                                                |
| User Profile created tags      | check user created tags                                                        |
|                                | edit tag                                                                       |
|                                | edit tag with used                                                             |
|                                | delete tag                                                                     |
|                                | delete tag with used                                                           |
| User Profile posted answers    | check user posted answers                                                      |
|                                | edit posted answer                                                             |
|                                | delete posted answer                                                           |

## Design Patterns Used

- Design Pattern Name:

- Problem Solved:

- Location in code where pattern is used:
