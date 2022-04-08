import { cleanup, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import BookingControl from './booking-control';

describe('BookingControl', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const dateHook = renderHook(() => useState(new Date()));
    const htmlIdHook = renderHook(() => useState(''));
    const handleSubmit = jest.fn();

    const container = render(
      <BookingControl
        areasData={{
          allowed: [],
          notAllowed: [],
        }}
        useHtmlId={() => htmlIdHook.result.current}
        useDate={() => dateHook.result.current}
        handleSubmit={handleSubmit}
        disableButton={false}
      />
    );

    expect(container.getByTestId('bookingControls')).toBeTruthy();
  });

  it('should disable button', () => {
    const dateHook = renderHook(() => useState(new Date()));
    const htmlIdHook = renderHook(() => useState(''));
    const handleSubmit = jest.fn();

    const container = render(
      <BookingControl
        areasData={{
          allowed: [],
          notAllowed: [],
        }}
        useHtmlId={() => htmlIdHook.result.current}
        useDate={() => dateHook.result.current}
        handleSubmit={handleSubmit}
        disableButton={true}
      />
    );

    expect(
      container.getByTestId('bookingControls').querySelector('button')
    ).toHaveAttribute('disabled');
  });

  it('should submit', () => {
    const dateHook = renderHook(() => useState(new Date()));
    const htmlIdHook = renderHook(() => useState(''));
    const handleSubmit = jest.fn();

    const container = render(
      <BookingControl
        areasData={{
          allowed: [],
          notAllowed: [],
        }}
        useHtmlId={() => htmlIdHook.result.current}
        useDate={() => dateHook.result.current}
        handleSubmit={handleSubmit}
        disableButton={false}
      />
    );

    userEvent.click(
      container.getByTestId('bookingControls').querySelector('button')
    );

    expect(handleSubmit).toBeCalled();
  });
});
