describe('permission', () => {
  beforeEach(() => cy.visit('/'));

  it('should redirect to login page', () => {
    cy.url().should('contain', '/auth/login');
  });

  it('should not be able to access Admin pages as user', () => {
    cy.login('user', true);
    cy.visit('/');
    cy.get('#navSideBar div:first button').should('not.contain', 'Admin');
  });

  it('should be able to access Admin pages as admin', () => {
    cy.login('admin', true);
    cy.visit('/');
    cy.get('#navSideBar div:first button').should('contain', 'Admin');
  });
});
