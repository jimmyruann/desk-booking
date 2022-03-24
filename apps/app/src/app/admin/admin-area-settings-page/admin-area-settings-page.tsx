import { Container, createStyles, Space } from '@mantine/core';
import { Location } from '@prisma/client';
import { useState } from 'react';
import LocationSettingHeader from '../admin-location-setting-page/components/location-settings-header/LocationSettingHeader';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AdminAreaSettingsPageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

export function AdminAreaSettingsPage(props: AdminAreaSettingsPageProps) {
  const [htmlId, setHtmlId] = useState('');
  const [location, setLocation] = useState<Location>(null);
  const { classes } = useStyles();

  return (
    <>
      <Container fluid className={classes.common}>
        <LocationSettingHeader handleLocationChange={setLocation} />
      </Container>
      <Space h="md" />
      {/* {location && (
        <MapLayout
          mapBoxProps={{
            htmlIdHook: [htmlId, setHtmlId],
            locationId: location.locationId,
          }}
        >
          <AreaSettingsForm htmlId={htmlId}/>
        </MapLayout>
      )} */}
    </>
  );
}

export default AdminAreaSettingsPage;
