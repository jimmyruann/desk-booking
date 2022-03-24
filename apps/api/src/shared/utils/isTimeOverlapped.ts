export const isTimeOverlapped = (
  date1: { startTime: Date; endTime: Date },
  date2: { startTime: Date; endTime: Date }
): boolean => {
  return date1.startTime < date2.endTime && date1.endTime > date2.startTime;
};
