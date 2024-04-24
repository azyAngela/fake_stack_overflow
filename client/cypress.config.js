const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: [
      "cypress/e2e/profile.cy.js",
      "cypress/e2e/search.cy.js",
      "cypress/e2e/tags.cy.js",
      "cypress/e2e/viewPosts.cy.js",
      "cypress/e2e/voting.cy.js",
      "cypress/e2e/createNewPosts.cy.js",
      "cypress/e2e/postModeration.cy.js",
      "cypress/e2e/commentOnPosts.cy.js",
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
