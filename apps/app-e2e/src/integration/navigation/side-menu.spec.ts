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

  it('side menu item should be able to open and close', () => {
    cy.contains('button', 'Booking').click();
    cy.get('[data-cy=sideBarItemList]').should('have.css', 'display', 'block');
    cy.contains('button', 'Booking').click();
    cy.get('[data-cy=sideBarItemList]').should('have.css', 'display', 'none');
  });

  it('side menu user item should open & close user menu', () => {
    cy.getLocalStorage('email').then((email) => {
      cy.get('[data-cy=userMenuButton]').click();
      cy.get('[data-cy=userMenu][role=menu]').should(
        'have.css',
        'display',
        'block'
      );
      cy.get('[data-cy=userMenuButton]').click();
      cy.get('body').should('not.contain.html', '[data-cy=userMenu]');
    });
  });

  it('should be able to logout', () => {
    cy.get('[data-cy=userMenuButton]').click();
    cy.get('body').contains('Logout').click();
    cy.url().should('contain', '/auth/login');
    cy.getCookie('jid').should('be.null');
  });
});
