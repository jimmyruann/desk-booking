import { Skeleton, Space } from '@mantine/core';

export const LocationSettingFormWrapperSkeleton = () => {
  return (
    <>
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Space h="md" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Space h="md" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Space h="md" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
    </>
  );
};

export default LocationSettingFormWrapperSkeleton;
