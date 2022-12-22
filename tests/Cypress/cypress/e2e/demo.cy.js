it('C6872: success', () => {
    cy.visit('https://example.cypress.io')
})


it('C6872: fails', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})
