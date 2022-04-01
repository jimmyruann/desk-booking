import { useState } from 'react';
import MapLayout from '../../../../shared/components/map/map-layout';
import {
  useMapLocation,
  withMapLocationProvider,
} from '../../../../shared/context/MapLocation.context';
import AdminLocationChanger from '../../components/admin-location-changer';
import AdminPageLayout from '../../components/admin-page-layout';
import AdminAreaSettingsForm from './components/admin-area-settings-form';

export function AdminAreaSettingsPage() {
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  const mapLocation = useMapLocation();

  return (
    <AdminPageLayout
      breadCrumbList={[
        { title: 'App Settings', href: '/admin/settings' },
        { title: 'Area Settings', href: '/admin/settings/area' },
      ]}
    >
      <AdminLocationChanger {...mapLocation} />
      <MapLayout
        locationId={mapLocation.currentLocation.locationId}
        mapContextProps={{
          currentId: currentHtmlId,
          setCurrentId: setCurrentHtmlId,
        }}
      >
        <AdminAreaSettingsForm htmlId={currentHtmlId} {...mapLocation} />
      </MapLayout>
    </AdminPageLayout>
  );
}

export default withMapLocationProvider(AdminAreaSettingsPage);
