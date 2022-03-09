describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should redirect to login page', () => {
    cy.url().should('contain', '/auth/login');
  });

  // it('should not be able to access Admin pages as user', () => {
  //   cy.login('user', true);
  // });
});
