import 'cypress-localstorage-commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(type: 'user' | 'admin', loggedIn: boolean): void;
      logout(): void;
      deleteAllBooking(): void;
    }
  }
}

Cypress.Commands.add('login', (type, loggedIn) => {
  cy.request(
    'POST',
    `/api/test/login?type=${type}&loggedIn=${loggedIn}`,
    null
  ).then((response) => {
    window.localStorage.setItem('email', response.body.user.email);
    window.localStorage.setItem('password', response.body.passwordRaw);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

Cypress.Commands.add('logout', () => {
  cy.request('GET', '/api/auth/logout');
});

Cypress.Commands.add('deleteAllBooking', () => {
  cy.request('POST', '/api/test/delete/all_bookings');
});
