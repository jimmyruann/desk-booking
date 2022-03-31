import { Divider, Space, Text } from '@mantine/core';
import {
  useMapLocation,
  withMapLocationProvider,
} from '../../../../shared/context/MapLocation.context';
import AdminLocationChanger from '../../components/admin-location-changer';
import AdminPageLayout from '../../components/admin-page-layout';
import LocationSettingFormWrapper from './components/location-settings-form-wrapper/LocationSettingFormWrapper';

/* eslint-disable-next-line */
export interface AdminLocationSettingPageProps {}

export function AdminLocationSettingPage(props: AdminLocationSettingPageProps) {
  const mapLocation = useMapLocation();
  return (
    <AdminPageLayout
      breadCrumbList={[
        { title: 'App Settings', href: '/admin/settings' },
        { title: 'Location Settings', href: '/admin/settings/location' },
      ]}
    >
      <AdminLocationChanger {...mapLocation} />
      <Divider my="sm" />
      <Text
        sx={(theme) => ({
          fontSize: 24,
        })}
      >
        <b>{mapLocation.currentLocation.displayName}</b> Settings
      </Text>
      <Space h="sm" />
      <LocationSettingFormWrapper location={mapLocation.currentLocation} />
    </AdminPageLayout>
  );
}

export default withMapLocationProvider(AdminLocationSettingPage);
