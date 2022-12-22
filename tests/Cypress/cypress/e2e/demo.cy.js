it('passes', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('Kitchen Sink');
})
