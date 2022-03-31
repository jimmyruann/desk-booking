import { useParams } from 'react-router';
import AdminPageLayout from '../components/admin-page-layout';
import { AdminFeedback } from './components/admin-feedback';
import AdminFeedbacks from './components/admin-feedbacks';

export const AdminFeedbackPage = () => {
  const { id } = useParams();
  const parsedId = parseInt(id);

  const defaultBreadCrumbList = [
    { title: 'Feedbacks', href: '/admin/feedbacks' },
  ];

  if (id && !isNaN(parsedId))
    return (
      <AdminPageLayout
        breadCrumbList={[
          ...defaultBreadCrumbList,
          { title: `Feedback ${id}`, href: `/admin/feedbacks/${id}` },
        ]}
      >
        <AdminFeedback id={parsedId} />
      </AdminPageLayout>
    );

  return (
    <AdminPageLayout breadCrumbList={defaultBreadCrumbList}>
      <AdminFeedbacks />
    </AdminPageLayout>
  );
};

export default AdminFeedbackPage;
