import { Container, createStyles } from '@mantine/core';

/* eslint-disable-next-line */
export interface AdminHomePageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

export function AdminHomePage(props: AdminHomePageProps) {
  const { classes } = useStyles();

  return (
    <Container fluid className={classes.common}>
      Admin dashboard
    </Container>
  );
}

export default AdminHomePage;
