import { Grid, NativeSelect, Text } from '@mantine/core';
import { Location } from '@prisma/client';
import _ from 'lodash';

/* eslint-disable-next-line */
export interface HeaderProps {
  locations: Location[];
  handleLocationChange: (location: Location) => void;
}

export const LocationSettingHeader = ({
  locations,
  handleLocationChange,
}: HeaderProps) => {
  return (
    <Grid grow>
      <Grid.Col span={6}>
        <Text>Location Settings</Text>
      </Grid.Col>
      <Grid.Col md={4} lg={2}>
        <NativeSelect
          data={locations.map((each) => each.locationId)}
          onChange={(event) =>
            handleLocationChange(
              _.find(locations, { locationId: event.currentTarget.value })
            )
          }
          placeholder="Pick one"
          required
        />
      </Grid.Col>
    </Grid>
  );
};

export default LocationSettingHeader;
