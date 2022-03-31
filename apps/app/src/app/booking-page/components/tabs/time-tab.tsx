import { AreaAvailabilityEntity } from '@desk-booking/data';
import { Checkbox, createStyles, ScrollArea, Table } from '@mantine/core';
import { UseListState } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { useNotifications } from '@mantine/notifications';
import { Location } from '@prisma/client';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { axiosApiClient } from '../../../../shared/api';
import Loading from '../../../../shared/components/loading/loading';

export interface TimeTabProps {
  availabilityHook: UseListState<AreaAvailabilityEntity & { checked: boolean }>;
  location: Location;
  htmlId: string;
  date: Date;
}

const useStyles = createStyles((theme) => ({
  booked: {
    backgroundColor: theme.colors.gray[0],
    opacity: '0.5',
  },
}));

const getAreaAvailabilityEntity = async (htmlId: string, date: Date) => {
  if (!htmlId || !date) return [];

  const { data } = await axiosApiClient.get<AreaAvailabilityEntity[]>(
    `/areas/${htmlId}/availabilities`,
    {
      params: { date },
    }
  );
  return data;
};

export function TimeTab({
  availabilityHook,
  location,
  htmlId,
  date,
}: TimeTabProps) {
  const { classes } = useStyles();
  const notifications = useNotifications();
  const [availability, availabilityHandler] = availabilityHook;

  const { status } = useQuery(
    ['GET_AREA_AVAILABILITIES', htmlId, date],
    () =>
      getAreaAvailabilityEntity(
        htmlId,
        dayjs(date).tz(location.timeZone).toDate()
      ),
    {
      onSuccess: (data) => {
        availabilityHandler.setState(
          data.map((each) => {
            return {
              ...each,
              checked: false,
            };
          })
        );
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error')
    return <div>Something went wrong while loading Availabilities</div>;

  const checkAll = availability.every((value) => value.checked);

  const indeterminate =
    availability.some((value) => value.checked) && !checkAll;

  const items = availability.map((item, i) => {
    return (
      <tr key={i} className={item.booked ? classes.booked : ''}>
        <td>
          <Checkbox
            key={i}
            checked={item.checked}
            disabled={item.booked}
            indeterminate={item.booked}
            onChange={(event) =>
              availabilityHandler.setItemProp(
                i,
                'checked',
                event.currentTarget.checked
              )
            }
          />
        </td>
        <td>{dayjs.tz(item.startTime, location.timeZone).format('hh:mm A')}</td>
        <td>{dayjs.tz(item.endTime, location.timeZone).format('hh:mm A')}</td>
      </tr>
    );
  });

  return (
    <ScrollArea style={{ height: 350 }} offsetScrollbars>
      <Table id="availabilityTable">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                checked={checkAll}
                indeterminate={indeterminate}
                transitionDuration={0}
                onChange={() =>
                  availabilityHandler.setState((current) =>
                    current.map((value) => ({ ...value, checked: !checkAll }))
                  )
                }
              />
            </th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default TimeTab;
