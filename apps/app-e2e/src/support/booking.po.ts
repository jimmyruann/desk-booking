import dayjs from 'dayjs';

export const getAvailabilities = (htmlId = '#singapore-room-7') => {
  cy.get('input[name=date]')
    .clear()
    .type(
      dayjs()
        .add(1, 'week')
        .startOf('week')
        .add(2, 'day')
        .format('MMMM D, YYYY')
    );
  cy.get(htmlId).click();
};
