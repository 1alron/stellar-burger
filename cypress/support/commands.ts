/// <reference types="cypress" />
Cypress.Commands.add('openIngredientDetails', (name) => {
  cy.contains('li', name).click();
  cy.get('[data-cy="modal"]').as('modal').should('be.visible');
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get('@modal').find('button').click();
  cy.get('@modal').should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-cy="modal-overlay"]').click({ force: true });
  cy.get('@modal').should('not.exist');
});

Cypress.Commands.add('addItemToConstructor', (name) => {
  cy.contains('li', name).contains('Добавить').click();
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      openIngredientDetails(name: string): Chainable;
      closeModalByButton(): Chainable;
      closeModalByOverlay(): Chainable;
      addItemToConstructor(name: string): Chainable;
    }
  }
}