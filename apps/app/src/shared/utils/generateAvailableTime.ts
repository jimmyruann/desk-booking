import RRule from 'rrule';
import { BookingItem } from '@desk-booking/ui';
import dayjs from 'dayjs';
import { isTimeOverlapped, roundTime } from './time';

interface GenerateAvailableTimeProps {
  from: Date;
  to: Date;
  intervalInMs: number;
  excludes?: { startTime: Date; endTime: Date }[];
  noPastTime?: boolean;
}

export const generateAvailableTime = ({
  from,
  to,
  intervalInMs,
  excludes,
  noPastTime,
}: GenerateAvailableTimeProps) => {
  const dtstartWithNoPastTime =
    new Date() > from ? roundTime(new Date(), intervalInMs, 'up') : from;

  // Generate a list of time base on intervals
  const generatedTimeAtInterval = new RRule({
    freq: RRule.SECONDLY,
    dtstart: noPastTime ? dtstartWithNoPastTime : from,
    until: to,
    interval: intervalInMs / 1000,
  }).all((date) => date < to);

  // Loop thru and return BookingItem
  const bookingItems: BookingItem[] = generatedTimeAtInterval.map((each) => {
    const startTime = each;
    const endTime = dayjs(startTime).add(intervalInMs, 'millisecond').toDate();

    const disabled = excludes
      ? excludes.some((curr) =>
          isTimeOverlapped(
            {
              startTime,
              endTime,
            },
            {
              startTime: curr.startTime,
              endTime: curr.endTime,
            }
          )
        )
      : false;

    return {
      startTime,
      endTime,
      disabled: disabled,
    };
  });

  return bookingItems;
};
