import { createStyles, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  heading: {
    fontWeight: 500,
    fontSize: 24,
  },
  content: {
    paddingBlock: theme.spacing.xs,
  },
}));

export const FeedbackHeader = () => {
  const { classes } = useStyles();

  return (
    <>
      <Text className={classes.heading}>We need feedbacks</Text>
      <Text className={classes.content}>
        Your feedback is needed for us to continue improving the application.
      </Text>
    </>
  );
};

export default FeedbackHeader;
