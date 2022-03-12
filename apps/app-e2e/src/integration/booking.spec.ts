import dayjs from 'dayjs';

describe('Booking', () => {
  before(() => {
    cy.deleteAllBooking();
    cy.login('user', true);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jid');
    cy.restoreLocalStorage();
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
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();
    cy.get('#availableTimeList').should('contain.html', 'button');
  });

  it('should be able to paginate available time', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    cy.get('#availableTimeList button:first').then((curr) => {
      // Change page
      cy.get('#availableTimeListPagination button:first').next().next().click();
      cy.get('#availableTimeList button:first').should(
        'not.contain.html',
        curr.html
      );
    });
  });

  it('should be able to check available time', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    cy.get('#availableTimeList button:first').then((prev) => {
      cy.get('#availableTimeList button:first')
        .click()
        .should('not.contain.html', prev.html)
        .should('have.css', 'background-color', 'rgb(211, 249, 216)');
    });
  });

  it('should be able to check multiple available time', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    cy.get('#availableTimeList button:first').then((prev) => {
      cy.get('#availableTimeList button:first')
        .click()
        .should('not.contain.html', prev.html)
        .should('have.css', 'background-color', 'rgb(211, 249, 216)');
    });
    cy.get('#availableTimeList button:first')
      .next()
      .then((prev) => {
        cy.get('#availableTimeList button:first')
          .next()
          .click()
          .should('not.contain.html', prev.html)
          .should('have.css', 'background-color', 'rgb(211, 249, 216)');
      });
    cy.get('#availableTimeList button:first')
      .next()
      .next()
      .then((prev) => {
        cy.get('#availableTimeList button:first')
          .next()
          .next()
          .click()
          .should('not.contain.html', prev.html)
          .should('have.css', 'background-color', 'rgb(211, 249, 216)');
      });

    cy.get('#availableTimeList button:first')
      .next()
      .next()
      .next()
      .then((prev) => {
        cy.get('#availableTimeList button:first')
          .next()
          .next()
          .next()
          .click()
          .should('not.contain.html', prev.html)
          .should('have.css', 'background-color', 'rgb(211, 249, 216)');
      });
  });

  it('should disabled/not disabled button', () => {
    cy.get('#submitBookings').should('be.disabled');
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    cy.get('#availableTimeList button:first').then((prev) => {
      cy.get('#availableTimeList button:first')
        .click()
        .should('not.contain.html', prev.html)
        .should('have.css', 'background-color', 'rgb(211, 249, 216)');
    });
    cy.get('#submitBookings').should('not.be.disabled');
  });

  it('should submit booking and disabled selected time', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    cy.get('#availableTimeList button:first').click();
    cy.get('#submitBookings').click();

    cy.get('#availableTimeList button:first').should('be.disabled');

    // Notification
    cy.get('body').contains('You have booked singapore-room-7.');
  });

  it('should not be able to book the same area type at the same time', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-6').click();
    cy.get('#availableTimeList button:first').click();
    cy.get('#submitBookings').click();

    cy.get('body').contains(/(?<=One )(.*)(?= at a time)/);
  });

  it('should be able to show who booked at People Tab', () => {
    cy.get('input[name=date]')
      .clear()
      .type(
        dayjs()
          .add(1, 'week')
          .startOf('week')
          .add(2, 'day')
          .format('MMMM D, YYYY')
      );
    cy.get('#singapore-room-7').click();

    // Selected
    cy.get('#peopleTab')
      .click()
      .should('have.css', 'color', 'rgb(28, 126, 214)');

    cy.get('#peopleBookedTable tbody').should('not.be.null');
  });
});
