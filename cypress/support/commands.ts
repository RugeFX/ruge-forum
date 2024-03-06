/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  cy.session(
    email,
    () => {
      cy.visit("/login");

      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="password"]').should("be.visible");
      cy.get("button")
        .contains(/^Login$/)
        .should("be.visible");

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);

      cy.get("button")
        .contains(/^Login$/)
        .click();

      cy.url().should("not.include", "login");
      cy.get("div[role=modal]").should("not.exist");
      cy.get("header")
        .contains(/^RUGE$/)
        .should("be.visible");
      cy.get('img[alt*="Profile Picture"]').should("be.visible");
    },
    {
      validate: () => {
        expect(localStorage.getItem("user-token")).to.not.be.null;
      }
    }
  );
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
