import MapLayout from '../../../../../shared/components/map/map-layout';
import { useMapLocation } from '../../../../../shared/context/MapLocation.context';
import AdminAreaSettingsForm from './admin-area-settings-form';

interface AdminAreaSettingsWrapperProps {
  useCurrentHtmlId: () => [string, (value: string) => void];
}

export const AdminAreaSettingsWrapper = ({
  useCurrentHtmlId,
}: AdminAreaSettingsWrapperProps) => {
  const mapLocation = useMapLocation();
  const [currentHtmlId, setCurrentHtmlId] = useCurrentHtmlId();
  return (
    <MapLayout
      locationId={mapLocation.currentLocation.locationId}
      mapContextProps={{
        currentId: currentHtmlId,
        setCurrentId: setCurrentHtmlId,
      }}
    >
      <AdminAreaSettingsForm htmlId={currentHtmlId} />
    </MapLayout>
  );
};

export default AdminAreaSettingsWrapper;
