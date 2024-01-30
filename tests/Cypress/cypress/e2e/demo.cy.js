it('C6872: success', () => {
    cy.visit('https://example.cypress.io')
})


it('C6872: fails', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})

it.skip('C6872: skipped', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})

it('C6872: fails 2', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})

it('C6872: fails 3', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('TestRail');
})

