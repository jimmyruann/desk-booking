describe('Side menu', () => {
  before(() => {
    Cypress.Cookies.defaults({
      preserve: 'jid',
    });

    cy.login('user', true);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should be logged in', () => {
    cy.getLocalStorage('email').then((email) => {
      cy.get('body').should('contain', email);
    });
  });

  it('should be able to open location options', () => {
    cy.get('[data-cy=changeLocationButton]').click();
    cy.get('[data-cy=locationMenuLabel]').should('not.be.undefined');
    cy.get('[data-cy=changeLocationButton]').click();
  });

  it('should be able to change location', () => {
    cy.get('[data-cy=changeLocationButton]').click();
    cy.get('[data-cy=location-sydney-lv16]').click();
    cy.get('[data-cy=svgMapHeadingLocation]').should('contain', 'sydney-lv16');
  });
});
