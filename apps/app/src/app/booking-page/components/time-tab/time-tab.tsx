import { AreaAvailability } from '@desk-booking/data';
import { Checkbox, createStyles, ScrollArea, Table } from '@mantine/core';
import { UseListState } from '@mantine/hooks/lib/use-list-state/use-list-state';
import { Location } from '@prisma/client';
import dayjs from 'dayjs';
import './time-tab.module.css';

/* eslint-disable-next-line */
export interface TimeTabProps {
  availabilityHook: UseListState<AreaAvailability & { checked: boolean }>;
  location: Location;
}

const useStyles = createStyles((theme) => ({
  booked: {
    backgroundColor: theme.colors.gray[0],
    opacity: '0.5',
  },
}));

export function TimeTab({ availabilityHook, location }: TimeTabProps) {
  const { classes } = useStyles();

  const [availability, availabilityHandler] = availabilityHook;

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
    <ScrollArea style={{ height: 300 }} offsetScrollbars>
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
