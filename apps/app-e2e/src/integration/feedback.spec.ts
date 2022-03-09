describe('Feedback', () => {
  before(() => {
    Cypress.Cookies.defaults({
      preserve: 'jid',
    });
    cy.login('user', true);

    cy.saveLocalStorage();
  });

  after(() => {
    cy.logout();
    cy.clearLocalStorageSnapshot();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should be able to navigate to feedback page', () => {
    cy.visit('/');

    cy.get('#navSideBar').contains('Feedback').click();
    cy.get('#navSideBar').contains('Give Feedback').click();
    cy.url().should('contain', 'feedback');
    cy.get('main').should('contain', 'We need feedbacks');
  });

  it('should be able to submit a feedback', () => {
    cy.visit('/feedback');
    cy.get('form[name=feedbackForm]').get('select').select('Issues');
    cy.get('form[name=feedbackForm]');
    cy.get('input[name=title]').type('This is an example Title');
    cy.get('textarea[name=description]').type(
      'Ut imperdiet quam arcu, sit amet gravida felis consectetur non.'
    );
    cy.get('form[name=feedbackForm]').submit();
    cy.get('body').should('contain', 'We received your feedback');
  });
});
