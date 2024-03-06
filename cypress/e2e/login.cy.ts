describe("Login spec", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display login page correctly", () => {
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get("button")
      .contains(/^Login$/)
      .should("be.visible");
  });

  it("should display error message after submitting with an empty username input", () => {
    cy.get("button")
      .contains(/^Login$/)
      .click();

    cy.get("span[role=alert]").contains("email").should("be.visible");
  });

  it("should display error message after submitting with an empty password input", () => {
    cy.get('input[name="email"]').type("test@email.com");

    cy.get("button")
      .contains(/^Login$/)
      .click();

    cy.get("span[role=alert]").contains("Password").should("be.visible");
  });

  it("should display error message after submitting with invalid username and password", () => {
    cy.get('input[name="email"]').type("testruge@email.com");
    cy.get('input[name="password"]').type("wrong_password");

    cy.get("button")
      .contains(/^Login$/)
      .click();

    cy.get("span[role=alert]").contains("incorrect").should("be.visible");
  });

  it("should close login modal after submitting with valid username and password", () => {
    cy.get('input[name="email"]').type("test-ruge@email.com");
    cy.get('input[name="password"]').type("test123");

    cy.get("button")
      .contains(/^Login$/)
      .click();

    cy.url().should("not.include", "login");
    cy.get("div[role=modal]").should("not.exist");
    cy.get("header")
      .contains(/^RUGE$/)
      .should("be.visible");
    cy.get('img[alt*="Profile Picture"]').should("be.visible");
  });
});
