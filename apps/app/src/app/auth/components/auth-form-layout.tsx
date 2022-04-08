import { Box, Container, createStyles, Paper } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  box: {
    backgroundColor: theme.colors.gray[0],
  },
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: { width: 400 },
}));

export const AuthFormLayouts = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Container className={classes.container}>
        <Paper shadow="sm" p="xl" className={classes.paper}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthFormLayouts;
