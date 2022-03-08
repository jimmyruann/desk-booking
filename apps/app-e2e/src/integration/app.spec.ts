describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should redirect to login page', () => {
    cy.url().should('contain', '/auth/login');
  });
});
