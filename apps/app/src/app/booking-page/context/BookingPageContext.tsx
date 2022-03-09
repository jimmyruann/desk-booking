import React from 'react';

interface BookingPageContextProps {
  checked: boolean[];
  setChecked: (checked: boolean[]) => void;
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
}

export const BookingPageContext = React.createContext<BookingPageContextProps>({
  checked: [],
  setChecked: (checked: boolean[]) => null,
  currentHtmlId: '',
  setCurrentHtmlId: (currentHtmlId: string) => null,
});

export const useBookingPage = () => React.useContext(BookingPageContext);
