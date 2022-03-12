import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './digital-time.module.css';

/* eslint-disable-next-line */
export interface DigitalTimeProps extends React.HTMLProps<HTMLSpanElement> {
  timeZone: string;
  format?: string;
}

export function DigitalTime({ timeZone, format, ...props }: DigitalTimeProps) {
  const [clockState, setClockState] = useState(dayjs().tz(timeZone));

  useEffect(() => {
    setInterval(() => {
      setClockState(dayjs().tz(timeZone));
    }, 1000);
  }, [timeZone]);

  return <>{clockState.format(format || 'ddd MMM DD YYYY hh:mm:ss A')}</>;
}

export default DigitalTime;
