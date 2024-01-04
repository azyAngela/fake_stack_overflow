// Template test file. Change the file to add more tests.
describe("Create Account", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  // CREATE ACCOUNT

  it("allows a new user to register with valid credentials", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();
    // Assuming the registration endpoint will redirect to '/login' upon successful registration
    cy.url().should("include", "/login");
  });

  it("does not allow registration with an existing username", () => {
    // This assumes that 'existingUsername' and 'existingEmail@example.com' are already taken
    cy.visit("http://localhost:3000");
    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();
    // Replace the next line with the actual error message check that your application would provide
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Username is already taken`);
    });
  });

  it("does not allow registration with an existing email", () => {
    // This assumes that 'existingUsername' and 'existingEmail@example.com' are already taken
    cy.visit("http://localhost:3000");
    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername123");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();
    // Replace the next line with the actual error message check that your application would provide
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Email is already taken`);
    });
  });

  it("does not allow password to contain username or email", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Register").click();
    const username = "uniqueUser";
    const email = "uniqueuser@example.com";
    cy.get("#loginUsernameInput").type(username);
    cy.get("#loginEmailInput").type(email);
    cy.get("#loginPasswordInput").type(username); // Password contains the username
    cy.get("#loginConfirmPasswordInput").type(username);
    cy.get(".blue_btn").contains("sign-up").click();
    cy.contains("Password cannot contain the username").should("be.visible");

    // Clear the fields
    cy.get("#loginPasswordInput").clear();
    cy.get("#loginConfirmPasswordInput").clear();

    // Password contains the email
    cy.get("#loginPasswordInput").type(email);
    cy.get("#loginConfirmPasswordInput").type(email);
    cy.get(".blue_btn").contains("sign-up").click();
    cy.contains("Password cannot contain the email").should("be.visible");
  });

  it("validates email format", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("invalidEmail");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();
    cy.contains("Email is invalid").should("be.visible");
  });

  // LOGIN REGISTERED USER

  it("allows a registered user to login with correct credentials", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    // Assuming that on successful login the user is navigated to '/home'
    // Wait for an element on the home page to appear, indicating that the navigation has finished
    cy.url().should("include", "/home");
  });

  it("does not allow login with incorrect password", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("wrongPassword");
    cy.get(".blue_btn").contains("Login").click();
    // Assuming that on failed login an alert is shown

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Wrong password`);
    });
    // The user should remain on the login page
    cy.url().should("include", "/login");
  });

  it("does not allow login with incorrect username", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    const unregisteredUsername = "unregisteredUser";
    cy.get("#loginUsernameInput").type(unregisteredUsername);
    cy.get("#loginPasswordInput").type("anyPassword");
    cy.get(".blue_btn").contains("Login").click();
    // Assuming that on failed login an alert is shown
    cy.on("window:alert", (text) => {
      expect(text).to.contains(`User ${unregisteredUsername} not exists`);
    });
    // The user should remain on the login page
    cy.url().should("include", "/login");
  });

  it("shows error message when username is empty", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginPasswordInput").type("anyPassword");
    cy.get(".blue_btn").contains("Login").click();
    cy.contains("Username cannot be empty").should("be.visible");
  });

  it("shows error message when password is empty", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("registeredUser");
    cy.get(".blue_btn").contains("Login").click();
    cy.contains("Password cannot be empty").should("be.visible");
  });

  // LOGOUT OF THE ACCOUNT

  it("allows a registered user to successfully log out", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#menu_logout").click(); // Replace with the actual selector for the logout button
    // Assuming the user is redirected to the welcome page after logging out
    cy.url().should("include", "/"); // Adjust if your welcome page URL is different
  });

  //HOME PAGE FOR GUEST USER
});

describe("Home Page for Guest User", () => {
  beforeEach(() => {
    // Set up code that will run before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/home");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("displays the list of questions", () => {
    cy.get(".question").should("have.length.at.least", 0);
  });

  it("displays the correct information for each question if present", () => {
    const q = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", q[index]);
    });

    cy.get(".question").each(($el) => {
      cy.wrap($el).within(() => {
        cy.get(".postTitle").should("exist");
        cy.get(".postSummary").should("exist");
        //NOT WORKING
        //cy.get(".question_tags").find(".tagBtn").should("exist"); // Ensure this matches the class or element type for tags
        cy.get(".postStats").should("exist"); // If votes are within .postStats
        cy.get(".lastActivity").should("exist"); // If username and date are within .lastActivity
        // Assuming 'getMetaData' formats the date in a way that includes the word 'asked'
        cy.get(".question_meta").should("contain", "asked");
      });
    });
  });

  it("contains a functional search bar", () => {
    const searchTerm = "react";
    cy.get("#searchBar").should("exist");
    cy.get("#searchBar").type(`${searchTerm}{enter}`);
    cy.url().should(
      "include",
      `/home/question?keyword=${searchTerm}&from=search`
    );
  });

  it("can filter questions in Newest order", () => {
    // Assuming that the questions are listed in a container with a specific id or class
    cy.contains("Newest").click();
  });

  it("can filter questions in Active order", () => {
    // This assumes that there are filters for sorting the questions
    cy.contains("Active").click();
    // Add verification that questions have been sorted as per 'Active' criteria
  });

  it("can filter questions in Unanswered order", () => {
    cy.contains("Unanswered").click();
    // Add verification that questions have been sorted as per 'Unanswered' criteria
    cy.get(".question").should("not.exist");
  });

  it("displays only 5 questions at a time", () => {
    cy.get(".question").should("have.length.lte", 5);
  });

  it("shows the question count correctly", () => {
    // Ensure the question count element is present and capture its text
    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          // If there are more than 5 questions, next and prev buttons should be present
          cy.contains("next").should("be.visible");
          cy.contains("prev").should("be.visible");
        } else {
          // If there are 5 or fewer questions, next and prev buttons should not be present
          cy.contains("next").should("not.exist");
          cy.contains("prev").should("not.exist");
        }
      });
  });

  // prev for first page disabled
  //scrollable
});

// HOME PAGE FOR REGISTERED USER
describe("Home Page for Registered User", () => {
  beforeEach(() => {
    // Set up code that will run before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("can ask a question", () => {
    cy.contains("Ask a Question").click();
    cy.url().should("include", "newQuestion");
  });

  it("shows the question count correctly", () => {
    // Ensure the question count element is present and capture its text
    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          // If there are more than 5 questions, next and prev buttons should be present
          cy.contains("next").should("be.visible");
          cy.contains("prev").should("be.visible");
        } else {
          // If there are 5 or fewer questions, next and prev buttons should not be present
          cy.contains("next").should("not.exist");
          cy.contains("prev").should("not.exist");
        }
      });
  });

  it("displays the list of questions", () => {
    cy.get(".question").should("have.length.at.least", 0);
  });

  it("displays the correct information for each question if present", () => {
    cy.get(".question").each(($el) => {
      cy.wrap($el).within(() => {
        cy.get(".postTitle").should("exist");
        cy.get(".postSummary").should("exist");
        //NOT WORKING
        //cy.get(".question_tags").find(".tagBtn").should("exist"); // Ensure this matches the class or element type for tags
        cy.get(".postStats").should("exist"); // If votes are within .postStats
        cy.get(".lastActivity").should("exist"); // If username and date are within .lastActivity
        // Assuming 'getMetaData' formats the date in a way that includes the word 'asked'
        cy.get(".question_meta").should("contain", "asked");
      });
    });
  });

  it("contains a functional search bar", () => {
    const searchTerm = "react";
    cy.get("#searchBar").should("exist");
    cy.get("#searchBar").type(`${searchTerm}{enter}`);
    cy.url().should(
      "include",
      `/home/question?keyword=${searchTerm}&from=search`
    );
  });

  it("can filter questions in Newest order", () => {
    // Assuming that the questions are listed in a container with a specific id or class
    cy.contains("Newest").click();
  });

  it("can filter questions in Active order", () => {
    // This assumes that there are filters for sorting the questions
    cy.contains("Active").click();
    // Add verification that questions have been sorted as per 'Active' criteria
  });

  it("can filter questions in Unanswered order", () => {
    cy.contains("Unanswered").click();
    // Add verification that questions have been sorted as per 'Unanswered' criteria
  });

  it("displays only 5 questions at a time", () => {
    cy.get(".question").should("have.length.lte", 5);
  });

  // prev for first page disabled
  //scrollable
});

//SEARCHING
describe("Search Functionality Test Suite", () => {
  before(() => {
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    cy.url().should("include", "/home"); // Adjust if your welcome page URL is different
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("should allow users to search for questions and display results in Newest order", () => {
    const searchTerm = "react";
    // Enter search text in the search box
    //cy.get('input[name="search"]').type("example search keyword");
    cy.get("#searchBar", { timeout: 10000 })
      .should("be.visible")
      .type(searchTerm);

    // Simulate hitting enter to submit the search
    cy.get("#searchBar").type("{enter}");

    cy.url().should(
      "include",
      `/home/question?keyword=${searchTerm}&from=search`
    );

    // Validate that the search results are displayed
    // Make sure that '.search-results' is the correct selector for your search results container
    cy.get("#question_list").should("exist");

    // Assuming that the individual search results have a class '.search-result'
    // and the date they were created is found within an element with the class '.created-at',
    // validate that the search results are in Newest order
    let previousDate = new Date();
    cy.get("#question_list").each(($el, index, $list) => {
      const dateString = $el.find(".created-at").text();
      const currentDate = new Date(dateString);

      if (index > 0) {
        expect(currentDate).to.be.lte(previousDate);
      }
      previousDate = currentDate;
    });

    // Additionally, check if the title "Search Results" is displayed
    cy.contains("Search Result").should("exist");
  });
});

// TAGS
describe("Tags", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/home");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("displays all tags from the database and navigates correctly when clicked", () => {
    // Assuming "Tags" is clickable and leads to the tags page
    cy.contains("Tags").click();
    cy.url().should("include", "/tag");

    // Check if the list of tags is displayed
    cy.get(".tag_list").should("exist");

    // Get all tag nodes and store their count
    cy.get(".tag_list")
      .children()
      .its("length")
      .then((len) => {
        for (let i = 0; i < len; i++) {
          // We re-query the DOM for the list of tags on each iteration to avoid stale references
          cy.get(".tag_list .tagNode")
            .eq(i)
            .then(($tagNode) => {
              const tagName = $tagNode.find(".tagName").text().trim();
              const questionCountText = $tagNode
                .find("div")
                .last()
                .text()
                .trim();

              // Validate the text content of each tag
              expect(tagName).to.be.a("string");
              expect(questionCountText).to.match(/^\d+ questions$/);

              // Store the tag's name to use in the URL check after navigation
              const expectedUrl = `/home/question?keyword=[${tagName}]&from=tag`;

              // Click the tag
              cy.wrap($tagNode).click();

              // Check the new URL after navigation
              cy.url().should("include", expectedUrl);

              // Go back to the tag list page to continue the iteration
              cy.go("back");
              // You might need to add a wait or check to ensure the page has loaded before continuing
            });
        }
      });
  });
});

//NEW QUESTION
describe("New Question", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("allows a registered user with good repuation to post a new question", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.url().should("include", "/home"); // Adjust if your welcome page URL is different
    cy.contains("Ask a Question").click();
    // Fill in the form fields with valid data
    cy.get("#formTitleInput").type("What is Cypress?");
    cy.get("#formTextInput").type(
      "I want to learn more about Cypress testing."
    );
    cy.get("#formTagInput").type("Cypress Testing");
    const QUESTION_API_URL = "http://localhost:8000/question";
    // Intercept the POST request to the API endpoint for posting a question
    //cy.intercept("POST", "/api/questions").as("postQuestion");
    cy.intercept("POST", `${QUESTION_API_URL}/addQuestion`).as("addQuestion");

    // Submit the form
    cy.get(".blue_btn").contains("Post Question").click();

    // Check if redirected to the home page with the new question displayed
    cy.url().should("include", "/home");
    cy.contains("What is Cypress?").should("exist");
    cy.get("#question_list")
      .first()
      .within(() => {
        cy.contains("What is Cypress?").should("exist"); // Check for the new question's title
        // You can also check for other details like the question text or tags
      });
  });

  it("allows a registered user without good repuation cannot post a new question", () => {
    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    cy.url().should("include", "/home"); // Adjust if your welcome page URL is different

    cy.contains("Ask a Question").click();
    // Fill in the form fields with valid data
    cy.get("#formTitleInput").type("What is Cypress?");
    cy.get("#formTextInput").type(
      "I want to learn more about Cypress testing."
    );
    cy.get("#formTagInput").type("Cypress Testing");
    const QUESTION_API_URL = "http://localhost:8000/question";
    // Intercept the POST request to the API endpoint for posting a question
    //cy.intercept("POST", "/api/questions").as("postQuestion");
    cy.intercept("POST", `${QUESTION_API_URL}/addQuestion`).as("addQuestion");

    // Submit the form
    cy.get(".blue_btn").contains("Post Question").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        `New tags can only be added by users with reputation of 50 or more.`
      );
    });
  });
});

//ANSWERS GUEST USER
describe("Anwser page for Guest User", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/home");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("shows question details", () => {
    //click

    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          cy.get("#question_list").first().click();
          cy.url().should("include", "/answers");
          cy.get(".answer_question_title").should("exist");

          cy.get(".bold_title").should("exist");
          cy.get(".view_votes").should("exist");
          //cy.get(". question_main").should("exist");
          cy.get(".questionBody").should("exist");
          cy.get(".answer_question_text").should("exist");
          //cy.get(".answer_question_vote").should("exist");
          cy.get(".question_author").should("exist");
          cy.get(".answer_question_meta").should("exist");
        }
      });
  });

  it("shows answers", () => {
    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          cy.get("#question_list").first().click();
          cy.url().should("include", "/answers");
          cy.get(".answer_question_text").should("exist");
          cy.get("#answerText").should("exist");
          cy.get(".answerAuthor").should("exist");
          cy.get(".answer_question_meta").should("exist");
        }
      });
  });
});

//ANSWERS REGISTERED USER
describe("Answers fro registered User", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("shows question details", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          cy.get("#question_list").first().click();
          cy.url().should("include", "/answers");
          cy.get(".answer_question_title").should("exist");

          cy.get(".bold_title").should("exist");
          cy.get(".view_votes").should("exist");
          //cy.get(". question_main").should("exist");
          cy.get(".questionBody").should("exist");
          cy.get(".answer_question_text").should("exist");
          //cy.get(".answer_question_vote").should("exist");
          cy.get(".question_author").should("exist");
          cy.get(".answer_question_meta").should("exist");
        }
      });
  });

  it("shows answers", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_count")
      .invoke("text")
      .then((text) => {
        const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
        // Now you would assert based on the count
        if (questionCount > 5) {
          cy.get("#question_list").first().click();
          cy.url().should("include", "/answers");
          cy.get(".answer_question_text").should("exist");
          cy.get("#answerText").should("exist");
          cy.get(".answerAuthor").should("exist");
          cy.get(".answer_question_meta").should("exist");
        }
      });
  });

  it("Has Answer Question Button", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.contains("Answer Question").click();
  });

  it("Upvote the Question", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    //get up votes before click
    //cy.get(".answer_question_vote").find("upvote").click();
    cy.get(".question_main").within(() => {
      cy.get(".view_votes")
        .eq(1)
        .invoke("text")
        .then((votesText) => {
          const prevVotes = parseInt(votesText.split(" ")[0]);

          // Click the upvote button
          cy.contains("upvote").click();

          // After a brief delay (to allow for any animations or API calls), check the votes again
          cy.wait(500); // Adjust the wait time as necessary for your app's behavior
          cy.get(".view_votes")
            .eq(1)
            .invoke("text")
            .should((updatedVotesText) => {
              const updatedVotes = parseInt(updatedVotesText.split(" ")[0]);
              expect(updatedVotes).to.eq(prevVotes + 1); // Check if the votes have incremented by 1
            });
        });
    });
    //get up votes after click
  });

  it("Cant upvote the question with reputation less than 50", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("sana");
    cy.get("#loginPasswordInput").type("qwer");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    //get up votes before click
    //cy.get(".answer_question_vote").find("upvote").click();
    cy.get(".question_main").within(() => {
      cy.get(".view_votes")
        .eq(1)
        .invoke("text")
        .then((votesText) => {
          const prevVotes = parseInt(votesText.split(" ")[0]);

          // Click the upvote button
          cy.contains("upvote").click();

          // After a brief delay (to allow for any animations or API calls), check the votes again
          cy.wait(500); // Adjust the wait time as necessary for your app's behavior
          cy.on("window:alert", (str) => {
            expect(str).to.equal(
              "Only user with 50 or higher reputation could vote"
            );
          });
        });
    });
    //get up votes after click
  });

  it("Downvote the Question", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    //get up votes before click
    //cy.get(".answer_question_vote").find("upvote").click();
    cy.get(".question_main").within(() => {
      cy.get(".view_votes")
        .eq(1)
        .invoke("text")
        .then((votesText) => {
          const prevVotes = parseInt(votesText.split(" ")[0]);

          // Click the upvote button
          cy.contains("downvote").click();

          // After a brief delay (to allow for any animations or API calls), check the votes again
          cy.wait(500); // Adjust the wait time as necessary for your app's behavior
          cy.get(".view_votes")
            .eq(1)
            .invoke("text")
            .should((updatedVotesText) => {
              const updatedVotes = parseInt(updatedVotesText.split(" ")[0]);
              expect(updatedVotes).to.eq(prevVotes - 1); // Check if the votes have incremented by 1
            });
        });
    });
  });

  it("Cant downvote the Question with reputation less than 50", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("sana");
    cy.get("#loginPasswordInput").type("qwer");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    //get up votes before click
    //cy.get(".answer_question_vote").find("upvote").click();
    cy.get(".question_main").within(() => {
      cy.get(".view_votes")
        .eq(1)
        .invoke("text")
        .then((votesText) => {
          const prevVotes = parseInt(votesText.split(" ")[0]);

          // Click the upvote button
          cy.contains("downvote").click();

          // After a brief delay (to allow for any animations or API calls), check the votes again
          cy.wait(500); // Adjust the wait time as necessary for your app's behavior
          cy.on("window:alert", (str) => {
            expect(str).to.equal(
              "Only user with 50 or higher reputation could vote"
            );
          });
        });
    });
  });

  it("allows a user to upvote an answer", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    // Assuming each answer block has a unique identifier like an `aid` attribute
    cy.get(".answer_main")
      .first()
      .within(() => {
        let prevVotes;

        // Get the current number of votes
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .then((text) => {
            prevVotes = parseInt(text);
          });

        // Click the upvote button
        cy.get("button").contains("upvote").click();

        // Check that the number of votes has increased by 1
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .should((text) => {
            const currentVotes = parseInt(text);
            expect(currentVotes).to.eq(prevVotes + 1);
          });
      });
  });

  it("not allow a user to upvote an answer", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("sana");
    cy.get("#loginPasswordInput").type("qwer");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    // Assuming each answer block has a unique identifier like an `aid` attribute
    cy.get(".answer_main")
      .first()
      .within(() => {
        let prevVotes;

        // Get the current number of votes
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .then((text) => {
            prevVotes = parseInt(text);
          });

        // Click the upvote button
        cy.get("button").contains("upvote").click();

        // Check that the number of votes has increased by 1
        cy.on("window:alert", (str) => {
          expect(str).to.equal(
            "Only user with 50 or higher reputation could vote"
          );
        });
      });
  });

  it("allows a user to downvote an answer", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    // Assuming each answer block has a unique identifier like an `aid` attribute
    cy.get(".answer_main")
      .first()
      .within(() => {
        let prevVotes;

        // Get the current number of votes
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .then((text) => {
            prevVotes = parseInt(text);
          });

        // Click the upvote button
        cy.get("button").contains("downvote").click();

        // Check that the number of votes has increased by 1
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .should((text) => {
            const currentVotes = parseInt(text);
            expect(currentVotes).to.eq(prevVotes - 1);
          });
      });
  });

  it("not allows a user to downvote an answer", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("sana");
    cy.get("#loginPasswordInput").type("qwer");
    cy.get(".blue_btn").contains("Login").click();
    cy.get("#question_list").first().click();
    // Assuming each answer block has a unique identifier like an `aid` attribute
    cy.get(".answer_main")
      .first()
      .within(() => {
        let prevVotes;

        // Get the current number of votes
        cy.get(".answer_question_meta")
          .eq(1)
          .invoke("text")
          .then((text) => {
            prevVotes = parseInt(text);
          });

        // Click the upvote button
        cy.get("button").contains("downvote").click();

        cy.on("window:alert", (str) => {
          expect(str).to.equal(
            "Only user with 50 or higher reputation could vote"
          );
        });
      });
  });

  it("cant accept answer with other users", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("sana");
    cy.get("#loginPasswordInput").type("qwer");
    cy.get(".blue_btn").contains("Login").click();
    cy.get(".question").first().click();
    cy.contains("accept").should("not.exist");
  });

  it("accept answer", () => {
    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("saltyPeter");
    cy.get("#loginPasswordInput").type("654321");
    cy.get(".blue_btn").contains("Login").click();
    cy.get(".question").first().click();
    cy.contains("accept").should("exist");

    let ans = [
      "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
      "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
      "I just found all the above examples just too confusing, so I wrote my own.",
    ];
    cy.get(".answerText").each((el, idx) => {
      cy.wrap(el).should("contain", ans[idx]);
    });

    cy.get(".answer_vote")
      .eq(1)
      .within(() => {
        cy.contains("accept").click();
      });
    let ans1 = [
      "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
      "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
      "I just found all the above examples just too confusing, so I wrote my own.",
    ];
    cy.get(".answerText").each((el, idx) => {
      cy.wrap(el).should("contain", ans1[idx]);
    });
  });
});

// Comments for Guest User
describe("Comments for Guest User", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/home");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("displays comments for question body", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".question_main").within(() => {
      cy.get(".comments").should("exist");
      // Assert the initial number of comments displayed is correct (assuming 3 per page for example)
      cy.get(".comment_item").its("length").should("be.gte", 0);
    });
  });

  it("displays comments for answers", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length) {
        // If .comments exists, then check the number of .comment_item
        cy.wrap($comments)
          .find(".comment_item")
          .its("length")
          .should("be.gte", 0)
          .and("be.lte", 3);
      }
    });
  });

  it("displays comments for question body with detaills", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.wrap($comments)
          .find(".comment_item")
          .each(($comment) => {
            const $divs = $comment.find(".comment_item_right div");

            // Check if there are at least three divs for username
            if ($divs.length >= 3) {
              cy.wrap($divs.eq(2)).should("exist");
            }

            // Check if the number of votes is present
            //if ($divs.length >= 2) {
            //cy.wrap($divs.eq(1)).should("exist").and("contain", "votes");
            //}
            cy.get(".comment_item")
              .contains(/\d+ votes/)
              .should("exist");
          });
      }
    });
  });

  it("displays comments for answers with details", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.wrap($comments)
          .find(".comment_item")
          .each(($comment) => {
            const $divs = $comment.find(".comment_item_right div");

            // Check if there are at least three divs for username
            if ($divs.length >= 3) {
              cy.wrap($divs.eq(2)).should("exist");
            }

            // Check if the number of votes is present
            //if ($divs.length >= 2) {
            //cy.wrap($divs.eq(1)).should("exist").and("contain", "votes");
            //}
            cy.get(".comment_item")
              .contains(/\d+ votes/)
              .should("exist");
          });
      }
    });
  });

  it("next and prev buttons for the comments with more than 3 comments for Question", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length > 3) {
        cy.get(".pagination").should("exist");
        cy.get(".pagination").within(() => {
          cy.contains("prev").should("exist");
          cy.contains("next").should("exist");
        });
      }
    });
  });

  it("next and prev buttons for the comments with more than 3 comments for Answer", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length > 3) {
        cy.get(".pagination").should("exist");
        cy.get(".pagination").within(() => {
          cy.contains("prev").should("exist");
          cy.contains("next").should("exist");
        });
      }
    });
  });
});

// Comments for Registered User
describe("Comments for Registered User", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    cy.url().should("include", "/home"); // Adjust if your welcome page URL is different
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("displays comments for question body", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".question_main").within(() => {
      cy.get(".comments").should("exist");
      // Assert the initial number of comments displayed is correct (assuming 3 per page for example)
      cy.get(".comment_item").its("length").should("be.gte", 0);
    });
  });

  it("displays comments for answers", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length) {
        // If .comments exists, then check the number of .comment_item
        cy.wrap($comments)
          .find(".comment_item")
          .its("length")
          .should("be.gte", 0)
          .and("be.lte", 3);
      }
    });
  });

  it("displays comments for question body with detaills", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.wrap($comments)
          .find(".comment_item")
          .each(($comment) => {
            const $divs = $comment.find(".comment_item_right div");

            // Check if there are at least three divs for username
            if ($divs.length >= 3) {
              cy.wrap($divs.eq(2)).should("exist");
            }

            // Check if the number of votes is present
            //if ($divs.length >= 2) {
            //cy.wrap($divs.eq(1)).should("exist").and("contain", "votes");
            //}
            cy.get(".comment_item")
              .contains(/\d+ votes/)
              .should("exist");
          });
      }
    });
  });

  it("displays comments for answers with details", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.wrap($comments)
          .find(".comment_item")
          .each(($comment) => {
            const $divs = $comment.find(".comment_item_right div");

            // Check if there are at least three divs for username
            if ($divs.length >= 3) {
              cy.wrap($divs.eq(2)).should("exist");
            }

            // Check if the number of votes is present
            //if ($divs.length >= 2) {
            //cy.wrap($divs.eq(1)).should("exist").and("contain", "votes");
            //}
            cy.get(".comment_item")
              .contains(/\d+ votes/)
              .should("exist");
          });
      }
    });
  });

  it("next and prev buttons for the comments with more than 3 comments for Question", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length > 3) {
        cy.get(".pagination").should("exist");
        cy.get(".pagination").within(() => {
          cy.contains("prev").should("exist");
          cy.contains("next").should("exist");
        });
      }
    });
  });

  it("next and prev buttons for the comments with more than 3 comments for Answer", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");
    cy.get(".answer_main").then(($question) => {
      // Use jQuery's find() to check for .comments existence within the question
      const $comments = $question.find(".comments");
      if ($comments.length > 3) {
        cy.get(".pagination").should("exist");
        cy.get(".pagination").within(() => {
          cy.contains("prev").should("exist");
          cy.contains("next").should("exist");
        });
      }
    });
  });

  it("Upvote the Comment in the Question", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.get(".comment_item")
          .first()
          .within(() => {
            // Get the current vote count
            let prevVotes;
            cy.get(".comment_item_right div")
              .contains(/\d+ votes/)
              .invoke("text")
              .then((text) => {
                prevVotes = parseInt(text.split(" ")[0]);
                // Click the upvote button
                cy.contains("upvote").click();
                // Verify the vote count has increased
                cy.get(".comment_item_right div")
                  .contains(/\d+ votes/)
                  .invoke("text")
                  .should((newText) => {
                    const newVotes = parseInt(newText.split(" ")[0]);
                    expect(newVotes).to.eq(prevVotes + 1);
                  });
              });
          });
      }
    });
  });

  it("Upvote the Comment in the Answer", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".answer_main").then(($question) => {
      const $comments = $question.find(".comments");
      if ($comments.length) {
        cy.get(".comment_item")
          .first()
          .within(() => {
            // Get the current vote count
            let prevVotes;
            cy.get(".comment_item_right div")
              .contains(/\d+ votes/)
              .invoke("text")
              .then((text) => {
                prevVotes = parseInt(text.split(" ")[0]);
                // Click the upvote button
                cy.contains("upvote").click();
                // Verify the vote count has increased
                cy.get(".comment_item_right div")
                  .contains(/\d+ votes/)
                  .invoke("text")
                  .should((newText) => {
                    const newVotes = parseInt(newText.split(" ")[0]);
                    expect(newVotes).to.eq(prevVotes + 1);
                  });
              });
          });
      }
    });
  });

  it("Add comment to the Question", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".question_main").then(($question) => {
      const $comments = $question.find(".comments .comment_item");
      const initialCommentCount = $comments.length - 1;

      // Typing the new comment
      cy.get(".question_main .add_comment_input").type(
        "New comment for the question"
      );
      cy.get("button").contains("comment").click(); // Replace with the actual button text or selector

      // Wait for the comment to be posted (consider using cy.wait() for API call interception)

      expect($comments.length).to.equal(initialCommentCount + 1);
    });
  });

  it("Add comment to the Answer", () => {
    cy.get("#question_list").first().click();
    cy.url().should("include", "/answers");

    cy.get(".answer_main").first(() => {
      const $comments = cy.get(".comments .comment_item");
      let initialCommentCount = 0;

      // Checking if comments exist and getting initial count
      $comments.then(($commentItems) => {
        initialCommentCount = $commentItems.length;
      });

      // Typing the new comment in the first answer's comment section
      cy.get(".add_comment_input").first().type("New comment for the answer");
      cy.contains("Post Comment").click(); // Replace with the actual button text or selector

      var currCommentCount = 1;
      // Wait for the comment to be posted and verify the count has increased
      $comments.then(($commentItems) => {
        currCommentCount = $commentItems.length;
      });
      expect(currCommentCount).to.equal(initialCommentCount + 1);
    });
  });
});

// New answer page
//ANSWERS REGISTERED USER
describe("New answer for Registered User", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
    cy.visit("http://localhost:3000/");

    cy.contains("Register").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginEmailInput").type("newuser@example.com");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get("#loginConfirmPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("sign-up").click();

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("securePassword123");
    cy.get(".blue_btn").contains("Login").click();
    cy.url().should("include", "/home"); // Adjust if your welcome page URL is different
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("allows a user to answer a question", () => {
    // Iterate through each question in the list
    cy.get("#question_list")
      .children()
      .each(($question, index, $list) => {
        // For this example, we'll just answer the first question
        if (index === 0) {
          // Click the question to navigate to the question's detail page
          cy.wrap($question).click();

          // Assuming the URL changes to include '/answer', check the new URL
          cy.url().should("include", "/answer");

          cy.contains("Answer Question").click();

          // Fill in the answer form
          const answerText = "This is an insightful answer to the question.";
          cy.get("#answerTextInput").type(answerText);

          // Submit the answer
          cy.get(".blue_btn").contains("Post Answer").click();

          // Assuming there is a success message or redirection after posting
          // Adjust the expectation according to your application's behavior
          cy.url().should("include", "/answer");

          // Optionally check if the new answer is visible
          // Adjust the selector based on your application
          cy.contains(answerText).should("exist");

          // Stop iterating after the first question
          return false;
        }
      });
  });
});

// User profile userinof
describe("User profile userinfo", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("check user basic info", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("Joji John").should("exist");

    let cur = new Date();
    let date = new Date("2021-05-17T13:24:00");
    let diff = Math.round(
      (cur.getTime() - date.getTime()) / (1000 * 3600 * 24)
    );

    cy.contains(`Membership duration: ${diff} days`);

    cy.contains("reputation: 100").should("exist");
  });

  it("check user info", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("user info").click();
    cy.get("#editUsername").should("have.value", "Joji John");
    cy.get("#editEmail").should("have.value", "JJ@neu.com");
  });

  it("change user info with used username", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("user info").click();
    cy.get("#editUsername").clear();
    cy.get("#editUsername").type("saltyPeter");
    cy.get(".blue_btn").contains("Save").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Username is already taken");
    });
  });

  it("change user info with used email", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("user info").click();
    cy.get("#editEmail").clear();
    cy.get("#editEmail").type("sana@neu.com");
    cy.get(".blue_btn").contains("Save").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Email is already taken");
    });
  });

  it("change user info", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("user info").click();
    cy.get("#editUsername").clear();
    cy.get("#editUsername").type("newUsername");
    cy.get("#editEmail").clear();
    cy.get("#editEmail").type("newuser@neu.com");
    cy.get(".blue_btn").contains("Save").click();

    cy.url().should("eq", "http://localhost:3000/");

    cy.contains("Login").click();
    cy.get("#loginUsernameInput").type("newUsername");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.url().should("eq", "http://localhost:3000/home");
  });
});

describe("User Profile posted questions", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("check user posted questions", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("posted questions").click();
    let q = ["Programmatically navigate using React router"];

    cy.get(".profile_item").each((item, idx) => {
      expect(item).to.contain(q[idx]);
    });
  });

  it("edit question", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("posted questions").click();
    cy.contains("Programmatically navigate using React router").click();

    cy.get("#formTitleInput").should(
      "have.value",
      "Programmatically navigate using React router"
    );

    cy.get("#formTextInput").should(
      "have.value",
      "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate."
    );

    cy.get("#formTagInput").should("have.value", "react javascript");

    cy.get("#formTitleInput").type(" edited");

    cy.contains("Save").click();

    cy.contains("Programmatically navigate using React router edited").should(
      "exist"
    );

    cy.get("#menu_question").click();

    const q = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router edited",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q[idx]);
    });

    cy.contains("Active").click();

    const q1 = [
      "Programmatically navigate using React router edited",
      "android studio save string shared preference, start activity and load the saved string",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q1[idx]);
    });
  });

  it("delete question", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();

    cy.contains("posted questions").click();
    cy.contains("Programmatically navigate using React router").click();

    cy.get("#formTitleInput").should(
      "have.value",
      "Programmatically navigate using React router"
    );

    cy.get("#formTextInput").should(
      "have.value",
      "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate."
    );

    cy.get("#formTagInput").should("have.value", "react javascript");

    cy.contains("Delete").click();

    cy.contains("Programmatically navigate using React router edited").should(
      "not.exist"
    );

    cy.get("#menu_question").click();

    const q = [
      "android studio save string shared preference, start activity and load the saved string",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q[idx]);
    });
  });
});

describe("User Profile created tags", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("check user created tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("created tags").click();

    const tags = ["react", "javascript"];
    cy.get(".tagNode").each((item, idx) => {
      cy.wrap(item).should("contain", tags[idx]);
    });
  });

  it("edit tag", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("created tags").click();

    cy.contains("react").click();
    cy.get(".input_input").type("123");
    cy.contains("Save").click();

    const tags = ["react123", "javascript"];
    cy.get(".tagNode").each((item, idx) => {
      cy.wrap(item).should("contain", tags[idx]);
    });
  });

  it("edit tag with used", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("created tags").click();

    cy.contains("javascript").click();
    cy.get(".input_input").type("123");
    cy.contains("Save").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`This tag is used by other users`);
    });
  });

  it("delete tag", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("created tags").click();

    cy.contains("react").click();
    cy.contains("Delete").click();

    const tags = ["javascript"];
    cy.get(".tagNode").each((item, idx) => {
      cy.wrap(item).should("contain", tags[idx]);
    });
  });

  it("delete tag with used", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("Joji John");
    cy.get("#loginPasswordInput").type("123456");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("created tags").click();

    cy.contains("javascript").click();
    cy.contains("Delete").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`This tag is used by other users`);
    });
  });
});

describe("User Profile posted answers", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js");
  });

  it("check user posted answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("azad");
    cy.get("#loginPasswordInput").type("1234");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("posted answers").click();

    const a = ["On my end, I like to have a single history object "];
    cy.get(".profile_item").each((item, idx) => {
      expect(item).to.contain(a[idx]);
    });
  });

  it("edit posted answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("azad");
    cy.get("#loginPasswordInput").type("1234");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("posted answers").click();

    cy.contains("On my end, I like to have a single history object ").click();
    cy.get("#answerTextInput").should(
      "have.value",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."
    );

    cy.get("#answerTextInput").clear();
    cy.get("#answerTextInput").type(
      "edit answers edit answers edit answers edit answers edit answers edit answers edit answers"
    );

    cy.contains("Save").click();

    const a = ["edit answers edit answers edit answers edit answer"];
    cy.get(".profile_item").each((item, idx) => {
      expect(item).to.contain(a[idx]);
    });

    cy.get("#menu_question").click();

    const q = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q[idx]);
    });

    cy.contains("Active").click();

    const q1 = [
      "Programmatically navigate using React router",
      "android studio save string shared preference, start activity and load the saved string",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q1[idx]);
    });
  });

  it("delete posted answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();

    cy.get("#loginUsernameInput").type("azad");
    cy.get("#loginPasswordInput").type("1234");
    cy.get(".blue_btn").contains("Login").click();

    cy.get("#menu_profile").click();
    cy.contains("posted answers").click();

    cy.contains("On my end, I like to have a single history object ").click();
    cy.get("#answerTextInput").should(
      "have.value",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."
    );

    cy.contains("Delete").click();

    cy.get("#menu_question").click();

    const q = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q[idx]);
    });

    cy.contains("Active").click();

    const q1 = [
      "Programmatically navigate using React router",
      "android studio save string shared preference, start activity and load the saved string",
    ];

    cy.get(".postTitle").each(($item, idx) => {
      cy.wrap($item).should("contain", q1[idx]);
    });
  });
});
