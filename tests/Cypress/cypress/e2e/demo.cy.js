it('C6872: success', () => {
    cy.visit('https://example.cypress.io')
})


it('C6872: fails', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})

it.skip('C6873: skipped', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})
