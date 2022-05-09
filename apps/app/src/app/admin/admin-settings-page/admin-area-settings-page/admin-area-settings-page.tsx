import { Grid } from '@mantine/core';
import { useState } from 'react';
import Map from '../../../../shared/components/map/v2/map';
import { useMapLocation } from '../../../../shared/context/MapLocation.context';
import AdminPageLayout from '../../components/admin-page-layout';
import AdminAreaSettingsForm from './components/admin-area-settings-form';

export function AdminAreaSettingsPage() {
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  // const mapLocation = useMapLocation();
  const userLocation = useMapLocation();

  return (
    <AdminPageLayout
      breadCrumbList={[
        { title: 'App Settings', href: '/admin/settings' },
        { title: 'Area Settings', href: '/admin/settings/area' },
      ]}
    >
      <Grid grow>
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <Map
            locationId={userLocation.currentLocation.locationId}
            useHtmlId={() => [currentHtmlId, setCurrentHtmlId]}
          />
        </Grid.Col>

        <Grid.Col md={12} lg={5} xl={5}>
          <AdminAreaSettingsForm htmlId={currentHtmlId} />
        </Grid.Col>
      </Grid>
    </AdminPageLayout>
  );
}

export default AdminAreaSettingsPage;
