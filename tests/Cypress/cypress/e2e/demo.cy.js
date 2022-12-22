it('passes', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('Kitchen Sink');
})


it('fails', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})
