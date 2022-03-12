import { isTimeOverlapped, mergeTime, TimeProps } from './time';
import _ from 'lodash';

describe('mergeTime', () => {
  it('should be able to merge array of time', () => {
    const input: TimeProps[] = [
      {
        startTime: new Date('2022-02-25T01:00:00.000Z'),
        endTime: new Date('2022-02-25T02:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T02:00:00.000Z'),
        endTime: new Date('2022-02-25T03:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T03:00:00.000Z'),
        endTime: new Date('2022-02-25T04:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T05:00:00.000Z'),
        endTime: new Date('2022-02-25T06:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T07:00:00.000Z'),
        endTime: new Date('2022-02-25T08:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T08:00:00.000Z'),
        endTime: new Date('2022-02-25T09:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T22:00:00.000Z'),
        endTime: new Date('2022-02-25T23:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T20:00:00.000Z'),
        endTime: new Date('2022-02-25T21:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T21:00:00.000Z'),
        endTime: new Date('2022-02-25T22:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T19:00:00.000Z'),
        endTime: new Date('2022-02-25T20:00:00.000Z'),
      },
    ];

    const output: TimeProps[] = [
      {
        startTime: new Date('2022-02-25T01:00:00.000Z'),
        endTime: new Date('2022-02-25T04:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T05:00:00.000Z'),
        endTime: new Date('2022-02-25T06:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T07:00:00.000Z'),
        endTime: new Date('2022-02-25T09:00:00.000Z'),
      },
      {
        startTime: new Date('2022-02-25T19:00:00.000Z'),
        endTime: new Date('2022-02-25T23:00:00.000Z'),
      },
    ];

    expect(mergeTime(input)).toStrictEqual(output);
  });

  it('should merge array base on condition and "keep in mind" condition', () => {
    const input: ({ name: string } & TimeProps)[] = [
      {
        startTime: new Date('2022-02-20T01:00:00.000Z'),
        endTime: new Date('2022-02-20T02:00:00.000Z'),
        name: 'aaron',
      },
      {
        startTime: new Date('2022-02-20T02:00:00.000Z'),
        endTime: new Date('2022-02-20T03:00:00.000Z'),
        name: 'aaron',
      },
      {
        startTime: new Date('2022-02-20T02:00:00.000Z'),
        endTime: new Date('2022-02-20T03:00:00.000Z'),
        name: 'jimmy',
      },
      {
        startTime: new Date('2022-02-20T02:00:00.000Z'),
        endTime: new Date('2022-02-20T03:00:00.000Z'),
        name: 'sophia',
      },
      {
        startTime: new Date('2022-02-20T03:00:00.000Z'),
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'aaron',
      },
      {
        startTime: new Date('2022-02-20T03:00:00.000Z'),
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'jimmy',
      },
      {
        startTime: new Date('2022-02-20T03:00:00.000Z'),
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'sophia',
      },
    ];

    const output: ({ name: string } & TimeProps)[] = [
      {
        startTime: new Date('2022-02-20T01:00:00.000Z'),
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'aaron',
      },
      {
        startTime: new Date('2022-02-20T02:00:00.000Z'),
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'jimmy',
      },
      {
        endTime: new Date('2022-02-20T04:00:00.000Z'),
        name: 'sophia',
        startTime: new Date('2022-02-20T02:00:00.000Z'),
      },
    ];

    expect(
      mergeTime(input, 'name').every((x) => {
        return output.some((y) => _.isEqual(x, y));
      })
    ).toBeTruthy();
  });
});

describe('isTimeOverlapped', () => {
  it('should be true when two time overlap', () => {
    const a = {
      startTime: new Date('2011-10-01T01:00:00.000Z'),
      endTime: new Date('2011-10-01T03:00:00.000Z'),
    };
    const b = {
      startTime: new Date('2011-10-01T02:00:00.000Z'),
      endTime: new Date('2011-10-01T04:00:00.000Z'),
    };
    const c = {
      startTime: new Date('2011-10-01T03:00:00.000Z'),
      endTime: new Date('2011-10-01T05:00:00.000Z'),
    };
    const d = {
      startTime: new Date('2011-10-01T01:00:00.000Z'),
      endTime: new Date('2011-10-01T10:00:00.000Z'),
    };

    expect(isTimeOverlapped(a, b)).toBeTruthy();
    expect(isTimeOverlapped(b, c)).toBeTruthy();
    expect(isTimeOverlapped(c, d)).toBeTruthy();
  });

  it('should be false when two time doesnt overlap', () => {
    const a = {
      startTime: new Date('2011-10-01T01:00:00.000Z'),
      endTime: new Date('2011-10-01T03:00:00.000Z'),
    };
    const b = {
      startTime: new Date('2011-10-01T04:00:00.000Z'),
      endTime: new Date('2011-10-01T06:00:00.000Z'),
    };
    const c = {
      startTime: new Date('2011-10-01T06:00:00.000Z'),
      endTime: new Date('2011-10-01T07:00:00.000Z'),
    };

    expect(isTimeOverlapped(a, b)).toBeFalsy();
    expect(isTimeOverlapped(b, c)).toBeFalsy();
  });
});
