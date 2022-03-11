import { BookingItem } from '@desk-booking/ui';
import React, { useState } from 'react';

interface BookingPageContextProps {
  reset: () => void;
  checked: boolean[];
  setChecked: (checked: boolean[]) => void;
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  availabilities: BookingItem[];
  setAvailabilities: (availabilities: BookingItem[]) => void;
}

export const BookingPageContext = React.createContext<BookingPageContextProps>({
  reset: () => null,
  checked: [],
  setChecked: (checked: boolean[]) => null,
  currentHtmlId: '',
  setCurrentHtmlId: (currentHtmlId: string) => null,
  date: new Date(),
  setDate: (date: Date) => null,
  availabilities: [],
  setAvailabilities: (availabilities: BookingItem[]) => null,
});

export const useBookingPage = () => React.useContext(BookingPageContext);

export const BookingPageProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [date, setDate] = useState(new Date());
  const [checked, setChecked] = useState<boolean[]>([]);
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  const [availabilities, setAvailabilities] = useState<BookingItem[]>([]);

  const reset = () => {
    setDate(new Date());
    setChecked([]);
    setCurrentHtmlId('');
    setAvailabilities([]);
  };

  return (
    <BookingPageContext.Provider
      value={{
        reset,
        checked,
        setChecked,
        currentHtmlId,
        setCurrentHtmlId,
        date,
        setDate,
        availabilities,
        setAvailabilities,
      }}
    >
      {children}
    </BookingPageContext.Provider>
  );
};

export const withBookingPageProvider =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  ({ ...props }) => {
    return (
      <BookingPageProvider>
        <Component {...(props as P)} />
      </BookingPageProvider>
    );
  };
