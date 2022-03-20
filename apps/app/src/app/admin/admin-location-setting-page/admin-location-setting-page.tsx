import { Loading } from '@desk-booking/ui';
import { Container, createStyles } from '@mantine/core';
import { Location } from '@prisma/client';
import _ from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useApi } from '../../../shared/context/ApiClient';
import { LocationSettingFormWrapper } from './components/location-settings-form-wrapper/LocationSettingFormWrapper';
import LocationSettingFormWrapperSkeleton from './components/location-settings-form-wrapper/LocationSettingFormWrapperSkeleton';
import LocationSettingHeader from './components/location-settings-header/LocationSettingHeader';

/* eslint-disable-next-line */
export interface AdminLocationSettingPageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

export function AdminLocationSettingPage(props: AdminLocationSettingPageProps) {
  const { classes } = useStyles();
  const api = useApi();

  const [location, setLocation] = useState<Location>(null);

  const { data: locations, status } = useQuery(
    'GET_ALL_LOCATIONS',
    async () => {
      const { data } = await api.make.location.findAll();
      return data;
    },
    {
      onSuccess: (data) => {
        if (!location) {
          return setLocation(data[0]);
        }
        setLocation(_.find(data, { locationId: location.locationId }));
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div>Something went wrong</div>;

  return (
    <Container fluid className={classes.common}>
      <LocationSettingHeader
        locations={locations}
        handleLocationChange={setLocation}
      />
      {location ? (
        <LocationSettingFormWrapper location={location} />
      ) : (
        <LocationSettingFormWrapperSkeleton />
      )}
    </Container>
  );
}

export default AdminLocationSettingPage;
