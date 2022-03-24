import { Container, createStyles, Grid } from '@mantine/core';
import { TestMap } from '../../../app/booking-page/test-map';

interface MapLayoutProps {
  children: React.ReactNode;
  locationId: string;
}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

export const MapLayout = ({
  children,
  locationId,
  ...props
}: MapLayoutProps) => {
  const { classes } = useStyles();

  return (
    <Container fluid className={classes.common}>
      <Grid grow {...props}>
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <TestMap mapUrl={`/assets/floorplan/${locationId}.svg`} />
        </Grid.Col>

        <Grid.Col md={12} lg={5} xl={5}>
          {children}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default MapLayout;
