import { Card, Container, createStyles } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '400px',
  },
}));

export const AuthFormLayouts = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { classes } = useStyles();

  return (
    <Container className={classes.container}>
      <Card shadow="sm" p="xl" withBorder className={classes.card}>
        {children}
      </Card>
    </Container>
  );
};

export default AuthFormLayouts;
