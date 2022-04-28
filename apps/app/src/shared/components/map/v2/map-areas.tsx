import React from 'react';
import convert from 'react-from-dom/lib';
import MapArea from './map-area';
import { MapAreaStyleProps, MapCommonProps } from './types';

interface MapAreasProps extends MapCommonProps {
  styleData?: Record<string, MapAreaStyleProps>[];
  disabledIds?: string[];
  unavailableIds?: string[];
}

export const MapAreas = ({
  svgMap,
  useHtmlId,
  styleData = [],
  disabledIds = [],
  unavailableIds = [],
}: MapAreasProps) => {
  const [htmlId, setHtmlId] = useHtmlId();
  const mapAreas = convert(svgMap.getElementById('areas'));

  if (!mapAreas) return null;

  const renderMapAreas = Array.from<typeof MapArea>(
    React.isValidElement(mapAreas) &&
      mapAreas.props['children'] &&
      React.Children.map(mapAreas.props['children'], (child) => {
        if (React.isValidElement(child)) {
          const styles = styleData[child.props['id']] || undefined;
          return (
            <MapArea
              type={child.type as keyof React.ReactSVG}
              active={
                child.props['id'] && (child.props['id'] as string) === htmlId
              }
              onClick={(event) => setHtmlId(event.currentTarget.id)}
              styles={styles}
              disabled={disabledIds.includes(child.props['id'])}
              unavailable={unavailableIds.includes(child.props['id'])}
              {...child.props}
            />
          );
        }

        return null;
      })
  ).filter((n) => n);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{renderMapAreas}</>;
};

export default MapAreas;
