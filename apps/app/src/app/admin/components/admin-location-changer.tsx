import { LocationEntity } from '@desk-booking/data';
import { Select, Space } from '@mantine/core';

interface AdminLocationChangerProps {
  locations: LocationEntity[];
  currentLocation: LocationEntity;
  changeCurrentLocation: (locationId: string) => void;
}

export const AdminLocationChanger = ({
  locations,
  currentLocation,
  changeCurrentLocation,
}: AdminLocationChangerProps) => {
  return (
    <>
      <Select
        label="Select the location to configure"
        placeholder="Pick one"
        data={locations.map((each) => ({
          label: each.displayName,
          value: each.locationId,
        }))}
        onChange={changeCurrentLocation}
        value={currentLocation.locationId}
        data-testid="locationChanger"
      />
      <Space h="lg" />
    </>
  );
};

export default AdminLocationChanger;
