import { FeedbackListEntity } from '@desk-booking/data';
import { createStyles, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { axiosApiClient } from '../../../../shared/api';
import { ServerError } from '../../../../shared/components/errors/server-error';
import Loading from '../../../../shared/components/loading/loading';

dayjs.extend(utcPlugin);

const getFeedbacks = async () => {
  const { data } = await axiosApiClient.get<FeedbackListEntity[]>(
    '/feedback/list'
  );
  return data;
};

const useStyles = createStyles((theme) => ({
  row: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: theme.colors.blue[0],
    },
  },
}));

export const AdminFeedbacks = () => {
  const { classes } = useStyles();
  const navigation = useNavigate();

  const { data, status } = useQuery('feedbacks', () => getFeedbacks());
  if (status === 'loading') return <Loading fullscreen />;
  if (status === 'error') return <ServerError />;

  const feedbacks = data.map((feedback) => {
    return (
      <tr
        key={feedback.id}
        onClick={() => navigation(`${feedback.id}`)}
        className={classes.row}
      >
        <td>{`${feedback.User.firstName} ${feedback.User.lastName}`}</td>
        <td>{feedback.User.email}</td>
        <td>
          <Text transform="capitalize">{feedback.type}</Text>
        </td>
        <td>
          <Text transform="capitalize">{feedback.title}</Text>
        </td>
        <td>{dayjs(feedback.updatedAt).format('h:mm A MMMM D, YYYY')}</td>
      </tr>
    );
  });

  return (
    <Table data-testid="feedbackValues">
      <thead>
        <tr>
          <th>User</th>
          <th>User Email</th>
          <th>Type</th>
          <th>Title</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody data-testid="feedbackValuesTBody">{feedbacks}</tbody>
    </Table>
  );
};

export default AdminFeedbacks;
