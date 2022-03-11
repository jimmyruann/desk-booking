import { BookingItem } from '@desk-booking/ui';
import React from 'react';

interface BookingPageContextProps {
  checked: boolean[];
  setChecked: (checked: boolean[]) => void;
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  availabilities: BookingItem[];
}

export const BookingPageContext = React.createContext<BookingPageContextProps>({
  checked: [],
  setChecked: (checked: boolean[]) => null,
  currentHtmlId: '',
  setCurrentHtmlId: (currentHtmlId: string) => null,
  date: new Date(),
  setDate: (date: Date) => null,
  availabilities: [],
});

export const useBookingPage = () => React.useContext(BookingPageContext);
