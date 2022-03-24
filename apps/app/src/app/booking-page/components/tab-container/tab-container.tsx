import { AreaAvailabilityEntity } from '@desk-booking/data';
import { Tabs } from '@mantine/core';
import { UseListState } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { Location } from '@prisma/client';
import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import PeopleTab from '../people-tab/people-tab';
import TimeTab from '../time-tab/time-tab';

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
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs grow active={activeTab} onTabChange={setActiveTab}>
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
        label="People"
        icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
      >
        <PeopleTab htmlId={htmlId} date={date} location={location} />
      </Tabs.Tab>
    </Tabs>
  );
};

export default TabContainer;
