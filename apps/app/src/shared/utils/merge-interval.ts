interface MergeIntervalArrayProps {
  startTime: number;
  endTime: number;
}

export const mergeInterval = (ranges: MergeIntervalArrayProps[]) => {
  const result: MergeIntervalArrayProps[] = [];
  let last: MergeIntervalArrayProps;

  ranges.forEach((r) => {
    if (!last || r.startTime > last.endTime) {
      result.push((last = r));
    } else if (r.endTime > last.endTime) last.endTime = r.endTime;
  });

  return result;
};
