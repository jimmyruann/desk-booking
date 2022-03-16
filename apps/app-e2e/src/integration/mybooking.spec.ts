describe('My booking page', () => {
  before(() => {
    cy.deleteAllBooking();
    cy.login('user', true);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jid');
    cy.restoreLocalStorage();
    cy.visit('/mybooking');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
});
