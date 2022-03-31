import { Space } from '@mantine/core';
import { Location } from '@prisma/client';
import { useState } from 'react';
import AdminPageLayout from '../../components/admin-page-layout';
import { LocationSettingFormWrapper } from './components/location-settings-form-wrapper/LocationSettingFormWrapper';
import LocationSettingFormWrapperSkeleton from './components/location-settings-form-wrapper/LocationSettingFormWrapperSkeleton';
import LocationSettingHeader from './components/location-settings-header/LocationSettingHeader';

/* eslint-disable-next-line */
export interface AdminLocationSettingPageProps {}

export function AdminLocationSettingPage(props: AdminLocationSettingPageProps) {
  const [location, setLocation] = useState<Location>(null);

  return (
    <AdminPageLayout
      breadCrumbList={[
        { title: 'App Settings', href: '/admin/settings' },
        { title: 'Location Settings', href: '/admin/settings/location' },
      ]}
    >
      <LocationSettingHeader handleLocationChange={setLocation} />
      <Space h="lg" />
      {location ? (
        <LocationSettingFormWrapper location={location} />
      ) : (
        <LocationSettingFormWrapperSkeleton />
      )}
    </AdminPageLayout>
  );
}

export default AdminLocationSettingPage;
