import { AreaAvailability } from '@desk-booking/data';
import { Loading } from '@desk-booking/ui';
import { Tabs } from '@mantine/core';
import { UseListState } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { useNotifications } from '@mantine/notifications';
import { Location } from '@prisma/client';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useApi } from '../../../../shared/context/ApiClient';
import PeopleTab from '../people-tab/people-tab';
import TimeTab from '../time-tab/time-tab';

interface TabContainerProps {
  availabilityHook: UseListState<AreaAvailability & { checked: boolean }>;
  htmlId: string;
  date: Date;
  location: Location;
}

export const TabContainer = ({
  availabilityHook,
  htmlId,
  date,
  location,
}: TabContainerProps) => {
  const api = useApi();
  const notifications = useNotifications();
  const [availability, availabilityHandler] = availabilityHook;

  const { data, status } = useQuery(
    ['GET_AREA_AVAILABILITIES', { htmlId, date }] as const,
    async ({ queryKey }) => {
      const { date, htmlId } = queryKey[1];
      if (!date || !htmlId) return null;

      const dayjsInUserTimeZone = dayjs(date).tz(location.timeZone);

      const { data } = await api.make.area.findAvailabilities({
        id: htmlId,
        date: dayjsInUserTimeZone,
      });

      return data;
    },
    {
      onSuccess: (areaData) => {
        const availabilities = areaData
          ? areaData.availabilities.map((each) => {
              return {
                ...each,
                checked: false,
              };
            })
          : [];
        availabilityHandler.setState(availabilities);
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
      refetchOnMount: false,
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error')
    return <div>Something went wrong while loading Availabilities</div>;

  return (
    <Tabs grow>
      <Tabs.Tab
        label="Booking"
        icon={<HiOutlineCalendar size={18} id="bookingTab" />}
      >
        <TimeTab
          location={location}
          availabilityHook={[availability, availabilityHandler]}
        />
      </Tabs.Tab>

      <Tabs.Tab
        label="People"
        icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
      >
        <PeopleTab data={data} location={location} />
      </Tabs.Tab>
    </Tabs>
  );
};

export default TabContainer;
