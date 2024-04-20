import React from 'react';
import Header from '../../src/components/header';

describe('<Header />', () => {
  it('renders with search bar and title', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = '';
    const title = 'Fake Stack Overflow';
    
    cy.mount(<Header search={searchQuery} handleSearch={handleSearchSpy} />);

    cy.get('#searchBar').should('have.value', searchQuery);
    cy.get('#searchBar').should('have.attr', 'placeholder', 'Search ...');
    cy.get('.title').contains(title);
  });

  it('updates search bar with text entered by user', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = 'test search';
    
    cy.mount(<Header search={searchQuery} handleSearch={handleSearchSpy} />);

    cy.get('#searchBar').should('have.value', searchQuery);
    cy.get('#searchBar').clear().type('Search change').should('have.value', 'Search change');
  });

  it('calls handleSearch when Enter key is pressed in search', () => {
    const handleSearchSpy = cy.spy().as('handleSearchSpy');
    const searchQuery = 'test search';

    cy.mount(<Header search={searchQuery} handleSearch={handleSearchSpy} />);

    cy.get('#searchBar').type('{enter}');
    cy.get('@handleSearchSpy').should('have.been.calledWith', searchQuery);
  });
});
