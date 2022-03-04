import { generateAvailableTime } from './generateAvailableTime';
import ms from 'ms';
describe('Utils', () => {
  it('should be able to generate time series', () => {
    const s = new Date('2011-10-01T00:00:00.000Z');
    const e = new Date('2011-10-02T00:00:00.000Z');
    const result = generateAvailableTime({
      intervalInMs: ms('1h'),
      from: s,
      to: e,
    });

    expect(result.length).toBe(24);
  });

  it('should be able to exclude and generate time series', () => {
    const s = new Date('2011-10-01T00:00:00.000Z');
    const e = new Date('2011-10-02T00:00:00.000Z');
    const result = generateAvailableTime({
      intervalInMs: ms('1h'),
      from: s,
      to: e,
      excludes: [
        {
          startTime: new Date('2011-10-01T10:00:00.000Z'),
          endTime: new Date('2011-10-01T20:00:00.000Z'),
        },
        {
          startTime: new Date('2011-10-01T02:00:00.000Z'),
          endTime: new Date('2011-10-01T04:00:00.000Z'),
        },
      ],
    });

    expect(result.filter((each) => each.disabled === true).length).toBe(12);
  });
});
