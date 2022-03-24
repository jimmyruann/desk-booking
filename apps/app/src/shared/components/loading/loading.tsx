import { createStyles, Loader, Text } from '@mantine/core';

/* eslint-disable-next-line */
export interface LoadingProps {
  message?: string;
  fullscreen?: boolean;
}

const useStyles = createStyles(
  (theme, { fullscreen }: { fullscreen: boolean }) => ({
    wrapper: {
      display: 'flex',
      height: fullscreen ? '100vh' : '100%',
      justifyContent: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    message: {
      fontWeight: 500,
    },
  })
);

export function Loading({ message, fullscreen = false }: LoadingProps) {
  const { classes } = useStyles({ fullscreen });

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <Loader size="lg" />
        {message && <Text className={classes.message}>{message}</Text>}
      </div>
    </div>
  );
}

export default Loading;
