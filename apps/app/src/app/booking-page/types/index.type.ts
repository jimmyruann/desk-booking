import { AreaAvailability } from '@desk-booking/data';
import { useListState } from '@mantine/hooks';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const wrapUseListState = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useListState<AreaAvailability & { checked: boolean }>([]);
