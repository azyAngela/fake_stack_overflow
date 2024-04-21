import React from 'react';
import Header from '../../src/components/header';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../../src/utlis/userprovider.js';

describe('<Header />', () => {
  it('renders with search bar and title', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = '';
    const title = 'Fake Stack Overflow';
    
    cy.mount(<UserProvider>
    <MemoryRouter>
          <Header search={searchQuery} handleSearch={handleSearchSpy} />
      </MemoryRouter>
      </UserProvider>
    );

    cy.get('#searchBar').should('have.value', searchQuery);
    cy.get('#searchBar').should('have.attr', 'placeholder', 'Search ...');
    cy.get('.title').contains(title);
    cy.get('#searchBar').should('be.visible');
    cy.get('.title').should('contain', 'Fake Stack Overflow');

  });

  it('updates search bar with text entered by user', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = '';

    cy.intercept('GET', '/profile/csrf-token', {
      statusCode: 200
    }).as('getCsrfToken');
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Header search={searchQuery} handleSearch={handleSearchSpy} />
        </MemoryRouter>
        </UserProvider>
      );
      cy.get('#searchBar').type('Hello World').should('have.value', 'Hello World');

  });

  it('calls handleSearch when Enter key is pressed in search', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = 'test search';
    cy.intercept('GET', '/profile/csrf-token', {
      statusCode: 200
    }).as('getCsrfToken');
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Header search={searchQuery} handleSearch={handleSearchSpy} />
        </MemoryRouter>
        </UserProvider>
      );

    cy.get('#searchBar').type('{enter}');
    cy.get('@handleSearchSpy').should('have.been.calledWith', searchQuery);
  });

  it('shows login and signup buttons when user is not logged in', () => {
    const searchQuery = '';
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    cy.intercept('GET', '/profile/csrf-token', {
      statusCode: 200
    }).as('getCsrfToken');
    cy.mount(<UserProvider>
      <MemoryRouter>
            <Header search={searchQuery} handleSearch={handleSearchSpy} />
        </MemoryRouter>
        </UserProvider>
      );
    cy.get('#loginButton').should('be.visible');
    cy.get('#signUpButton').should('be.visible');
  });
});
