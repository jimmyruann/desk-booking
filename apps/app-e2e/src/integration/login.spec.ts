import {
  getLoginEmailField,
  getLoginForm,
  getLoginPasswordField,
} from '../support/login.po';

describe('login', () => {
  before(() => {
    cy.logout();
  });
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearLocalStorageSnapshot();

    cy.visit('/auth/login');
  });

  it('should check if fields are empty', () => {
    getLoginForm().submit();
    getLoginForm().should('contain', 'Email is not valid');
    getLoginForm().should('contain', 'Password is required.');
  });

  it('should not login', () => {
    getLoginEmailField().type('admin@example.com');
    getLoginPasswordField().type('wrong_password');
    getLoginForm().submit();

    cy.should('contain', 'Invalid login credentials.');

    getLoginPasswordField().should('not.have.value');
  });

  it('should login', () => {
    cy.intercept({
      pathname: '/api/auth/login',
    }).as('post');

    getLoginEmailField().type('admin@example.com');
    getLoginPasswordField().type('password');
    getLoginForm().submit();

    cy.wait('@post').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body).not.to.eq(null);
    });

    cy.get('#root').should('contain', 'admin@example.com');
    cy.getCookie('jid').should('not.be.null');
  });
});
