import { useState } from 'react';
import { MapLocationProvider } from '../../../../shared/context/MapLocation.context';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import AdminPageLayout from '../../components/admin-page-layout';
import AdminAreaSettingsWrapper from './components/admin-area-settings-wrapper';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AdminAreaSettingsPageProps {}

export function AdminAreaSettingsPage(props: AdminAreaSettingsPageProps) {
  const { locations } = useUserLocation();
  const currentHtmlIdHook = useState('');

  return (
    <MapLocationProvider locations={locations}>
      <AdminPageLayout
        breadCrumbList={[
          { title: 'App Settings', href: '/admin/settings' },
          { title: 'Area Settings', href: '/admin/settings/area' },
        ]}
      >
        <AdminAreaSettingsWrapper useCurrentHtmlId={() => currentHtmlIdHook} />
      </AdminPageLayout>
    </MapLocationProvider>
  );
}

export default AdminAreaSettingsPage;
