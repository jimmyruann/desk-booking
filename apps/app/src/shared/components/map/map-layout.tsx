import { Grid } from '@mantine/core';
import TestMap from './test-map';
import { TestMapContext, TestMapContextProps } from './test-map-context';

interface MapLayoutProps {
  children: React.ReactNode;
  locationId: string;
  mapContextProps: TestMapContextProps;
}

export const MapLayout = ({
  children,
  locationId,
  mapContextProps,
  ...props
}: MapLayoutProps) => {
  return (
    <TestMapContext.Provider
      value={{
        ...mapContextProps,
        disabledIds: mapContextProps.disabledIds || [],
        unavailableIds: mapContextProps.unavailableIds || [],
      }}
    >
      <Grid grow {...props}>
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <TestMap mapUrl={`/assets/floorplan/${locationId}.svg`} />
        </Grid.Col>

        <Grid.Col md={12} lg={5} xl={5}>
          {children}
        </Grid.Col>
      </Grid>
    </TestMapContext.Provider>
  );
};

export default MapLayout;
