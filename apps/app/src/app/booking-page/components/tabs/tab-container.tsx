import { AreaAvailabilityEntity } from '@desk-booking/data';
import { Tabs } from '@mantine/core';
import { UseListState } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { Location } from '@prisma/client';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import BookedTab from './booked-tab';
import TimeTab from './time-tab';

interface TabContainerProps {
  availabilityHook: UseListState<AreaAvailabilityEntity & { checked: boolean }>;
  location: Location;
  htmlId: string;
  date: Date;
}

export const TabContainer = ({
  availabilityHook,
  htmlId,
  date,
  location,
}: TabContainerProps) => {
  const [availability, availabilityHandler] = availabilityHook;

  return (
    <Tabs
      grow
      sx={() => ({
        minHeight: 350,
      })}
    >
      <Tabs.Tab
        label="Booking"
        icon={<HiOutlineCalendar size={18} id="bookingTab" />}
      >
        <TimeTab
          htmlId={htmlId}
          date={date}
          location={location}
          availabilityHook={[availability, availabilityHandler]}
        />
      </Tabs.Tab>

      <Tabs.Tab
        label="Booked"
        icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
      >
        <BookedTab htmlId={htmlId} date={date} location={location} />
      </Tabs.Tab>
    </Tabs>
  );
};

export default TabContainer;
