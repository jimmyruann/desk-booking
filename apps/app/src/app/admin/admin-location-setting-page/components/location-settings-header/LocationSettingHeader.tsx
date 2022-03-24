import { LocationEntity } from '@desk-booking/data';
import { Grid, NativeSelect, Text } from '@mantine/core';
import { Location } from '@prisma/client';
import _ from 'lodash';
import { useQuery } from 'react-query';
import Loading from '../../../../../shared/components/loading/loading';
import { useApi } from '../../../../../shared/context/ApiClient';

/* eslint-disable-next-line */
export interface HeaderProps {
  handleLocationChange: (location: Location) => void;
}

export const LocationSettingHeader = ({
  handleLocationChange,
}: HeaderProps) => {
  const api = useApi();

  const { data: locations, status } = useQuery(
    'GET_ALL_LOCATIONS',
    async () => {
      const { data } = await api.client.get<LocationEntity[]>('/locations');
      return data;
    },
    {
      onSuccess: (data) => {
        handleLocationChange(data[0]);
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div>Something went wrong</div>;

  return (
    <Grid grow align="center">
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
