import { Space, Text } from '@mantine/core';
import { useMapLocation } from '../../../../shared/context/MapLocation.context';
import AdminPageLayout from '../../components/admin-page-layout';
import AdminLocationSettingForm from './components/admin-location-setting-form';

export function AdminLocationSettingPage() {
  const mapLocation = useMapLocation();
  return (
    <AdminPageLayout
      breadCrumbList={[
        { title: 'App Settings', href: '/admin/settings' },
        { title: 'Location Settings', href: '/admin/settings/location' },
      ]}
    >
      <Text
        sx={(theme) => ({
          fontSize: 24,
        })}
      >
        <b>{mapLocation.currentLocation.displayName}</b> Settings
      </Text>
      <Space h="sm" />
      <AdminLocationSettingForm location={mapLocation.currentLocation} />
    </AdminPageLayout>
  );
}

export default AdminLocationSettingPage;
