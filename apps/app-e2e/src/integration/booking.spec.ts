import { getAvailabilities } from '../support/booking.po';

describe('Booking', () => {
  before(() => {
    cy.login('user', true);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jid');
    cy.restoreLocalStorage();
    cy.deleteAllBooking();
    cy.visit('/');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should be able to select area', () => {
    cy.get('#singapore-room-7').click();
    cy.get('#singapore-room-7').should('have.css', 'fill', 'rgb(51, 154, 240)');
    cy.get('[data-cy=svgMapHeadingHtmlId]').should(
      'contain',
      'singapore-room-7'
    );
  });

  it('should be able to select new date', () => {
    cy.get('input[name=date]').click();
    cy.get('.mantine-DatePicker-calendarBase').should('be.visible');
  });

  it('should be able to show available time', () => {
    getAvailabilities('#singapore-room-7');
    cy.get('#availabilityTable tbody').should('not.to.match', ':empty');
  });

  it('should be able to select all and unselect all', () => {
    getAvailabilities('#singapore-room-7');

    // first availability and last should be checked
    cy.get('#availabilityTable input[type=checkbox]:first').check();
    cy.get('#availabilityTable tbody input[type=checkbox]:first').should(
      'be.checked'
    );
    cy.get('#availabilityTable tbody input[type=checkbox]:last').should(
      'be.checked'
    );

    // uncheck
    cy.get('#availabilityTable input[type=checkbox]:first').uncheck();
    cy.get('#availabilityTable tbody input[type=checkbox]:first').should(
      'not.be.checked'
    );
    cy.get('#availabilityTable tbody input[type=checkbox]:last').should(
      'not.be.checked'
    );
  });

  it('should be able to check multiple available time', () => {
    getAvailabilities('#singapore-room-7');

    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .eq(1)
      .check()
      .should('be.checked');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .eq(2)
      .check()
      .should('be.checked');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .eq(3)
      .check()
      .should('be.checked');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .eq(4)
      .check()
      .should('be.checked');
  });

  it('should disabled/not disabled button', () => {
    cy.get('#submitBookings').should('be.disabled');
    getAvailabilities('#singapore-room-7');

    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#submitBookings').should('not.be.disabled');
  });

  it('should submit booking and disabled selected time', () => {
    getAvailabilities('#singapore-room-7');

    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#submitBookings').click();

    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .should('be.disabled');

    // Notification
    cy.get('body').contains('You have booked');
  });

  it('should not be able to book the same area type at the same time', () => {
    getAvailabilities('#singapore-room-7');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#submitBookings').click();

    getAvailabilities('#singapore-room-6');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#submitBookings').click();

    cy.get('body').contains(/(?<=One )(.*)(?= at a time)/);
  });

  it('should be able to show who booked at People Tab', () => {
    getAvailabilities('#singapore-room-7');
    cy.get('#availabilityTable tbody input[type=checkbox]')
      .first()
      .check()
      .should('be.checked');
    cy.get('#submitBookings').click();

    // Selected
    cy.get('#peopleTab')
      .click()
      .should('have.css', 'color', 'rgb(28, 126, 214)');

    cy.get('#peopleBookedTable tbody').should('contain.html', 'tr');
  });
});
