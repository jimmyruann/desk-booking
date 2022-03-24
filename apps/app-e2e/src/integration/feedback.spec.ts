describe('Feedback', () => {
  before(() => {
    cy.login('user', true);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jid');
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
    cy.get('form[name=feedbackForm] select[name=feedbackType]').select(
      'Issues'
    );
    cy.get('form[name=feedbackForm] input[name=title]').type(
      'This is an example Title'
    );
    cy.get('form[name=feedbackForm] textarea[name=description]').type(
      'This is an example description'
    );
    cy.get('form[name=feedbackForm]').submit();
    cy.get('body').should('contain', 'We received your feedback');

    cy.get('form[name=feedbackForm] input[name=title]').should('be.empty');
    cy.get('form[name=feedbackForm] textarea[name=description]').should(
      'be.empty'
    );
  });
});
