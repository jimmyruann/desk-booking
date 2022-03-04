import _ from 'lodash';

export const roundTime = (
  date: Date,
  duration: number,
  round: 'up' | 'down'
): Date => {
  if (!duration) return date;
  return new Date(
    Math[`${round === 'up' ? 'floor' : 'ceil'}`](+date / duration) * duration
  );
};

export const isTimeOverlapped = (
  date1: { startTime: Date; endTime: Date },
  date2: { startTime: Date; endTime: Date }
): boolean => {
  return date1.startTime < date2.endTime && date1.endTime > date2.startTime;
};

/**
 * https://stackoverflow.com/a/26391774
 */
export interface TimeProps {
  startTime: Date;
  endTime: Date;
}

export const mergeTime = <T extends TimeProps>(
  dateTime: T[],
  groupByKey?: keyof T
): T[] => {
  const merge = (data: T[]) => {
    const sortedDateTime = data.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    const result = [];
    let last: T;

    for (let i = 0; i < sortedDateTime.length; i++) {
      const each = sortedDateTime[i];

      if (!last || each.startTime.getTime() > last.endTime.getTime()) {
        result.push((last = each));
      } else if (each.endTime.getTime() > last.endTime.getTime()) {
        last.endTime = each.endTime;
      }
    }

    return result;
  };

  // I give up, just use lodash
  if (groupByKey) {
    let result = [];

    for (const [key, value] of Object.entries(
      _.groupBy(dateTime, groupByKey)
    )) {
      result = [...result, ...merge(value)];
    }

    return result.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  return merge(dateTime);
};
