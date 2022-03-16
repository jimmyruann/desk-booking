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
