import { FeedbackEntity } from '@desk-booking/data';
import { Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { axiosApiClient } from '../../../../shared/api/api';
import Loading from '../../../../shared/components/loading/loading';

interface AdminFeedback {
  id: number;
}

const getFeedback = async (id: number) => {
  const { data } = await axiosApiClient.get<FeedbackEntity>(`/feedback/${id}`);
  return data;
};

export const AdminFeedback = ({ id }: AdminFeedback) => {
  const { data, status } = useQuery(['feedback', id], () => getFeedback(id));

  if (status === 'loading') return <Loading fullscreen />;
  if (status === 'error') return <div>Unable to find feedback {id}</div>;

  const tableData = [
    { type: 'Feedback Id', value: data.id },
    { type: 'User', value: `${data.User.firstName} ${data.User.lastName}` },
    { type: 'User Email', value: data.User.email },
    {
      type: 'Create at',
      value: dayjs(data.createAt).format('h:mm A MMMM D, YYYY'),
    },
    {
      type: 'Update at',
      value: dayjs(data.updatedAt).format('h:mm A MMMM D, YYYY'),
    },
    { type: 'Feedback Title', value: data.title },
    { type: 'Feedback Message', value: data.message },
  ];

  return (
    <Table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((each, i) => (
          <tr>
            <td>
              <b>{each.type}</b>
            </td>
            <td>{each.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminFeedback;
