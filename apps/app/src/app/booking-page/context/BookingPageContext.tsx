import { useApi } from '@app/src/shared/context/ApiClient';
import { AreaFindOneWithBookingReturn } from '@desk-booking/data';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface BookingPageContextProps {
  date: Date;
  setDate: (date: Date) => void;
  checked: boolean[];
  setChecked: (checked: boolean[]) => void;
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
}

export const BookingPageContext = React.createContext<BookingPageContextProps>({
  date: dayjs().startOf('day').toDate(),
  setDate: (date: Date) => null,
  checked: [],
  setChecked: (checked: boolean[]) => null,
  currentHtmlId: '',
  setCurrentHtmlId: (currentHtmlId: string) => null,
});

export const useBookingPage = () => React.useContext(BookingPageContext);
