import { Container, createStyles } from '@mantine/core';
import { Location } from '@prisma/client';
import { useState } from 'react';
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
  const [location, setLocation] = useState<Location>(null);

  return (
    <Container fluid className={classes.common}>
      <LocationSettingHeader handleLocationChange={setLocation} />
      {location ? (
        <LocationSettingFormWrapper location={location} />
      ) : (
        <LocationSettingFormWrapperSkeleton />
      )}
    </Container>
  );
}

export default AdminLocationSettingPage;
