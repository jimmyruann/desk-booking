import { Map, Node } from '@desk-booking/ui';
import { createStyles } from '@mantine/core';
import QueryStateHandler, {
  QueryHandlerProps,
} from '../../../../shared/components/query-state-handler/query-state-handler';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import './map-box.module.css';

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

/* eslint-disable-next-line */
export interface MapBoxProps extends QueryHandlerProps {
  data: Node;
  htmlIdHook: [string, (htmlId: string) => void];
}

export function MapBox({ data, status, error, htmlIdHook }: MapBoxProps) {
  const { classes } = useStyles();
  const userLocation = useUserLocation();
  const [currentHtmlId, setCurrentHtmlId] = htmlIdHook;

  return (
    <QueryStateHandler status={status} error={error}>
      {data && (
        <div className={classes.common}>
          <Map
            mapData={data}
            viewBox={
              data.attributes['viewBox'] &&
              data.attributes['viewBox']
                .split(' ')
                .map((each) => parseInt(each) || 0)
            }
            currentHtmlId={currentHtmlId}
            setCurrentHtmlId={setCurrentHtmlId}
            data-cy={`svgMap-${userLocation.location.name}`}
          />
        </div>
      )}
    </QueryStateHandler>
  );
}

export default MapBox;
