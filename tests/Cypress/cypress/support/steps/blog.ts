import {When, Then, Given, Before} from '@badeball/cypress-cucumber-preprocessor';


Before(() => {
    // cy.request('POST', '/api/reset')
})

Given('I am on the blog page', () => {
    cy.visit('/blog');
});

When(/^I click on tag (.*)$/, (tagName) => {
    cy.get('.article-tags__box > [href="/tags/?tag=' + tagName.toLowerCase() + '"]').first().click();
});

Then(/^I see tag (.*) as title$/, (tagName) => {
    cy.contains('h2', tagName);
});

Then('I enter tag {string} in the URL', (tagName) => {
    cy.visit('/tags/?tag=' + tagName, {failOnStatusCode: false});
});

Then('I must not see the blog', () => {
    cy.get('h2').should('not.exist');
});

