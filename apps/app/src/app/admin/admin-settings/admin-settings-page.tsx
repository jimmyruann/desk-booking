import { Link, useLocation } from 'react-router-dom';
import AdminPageLayout from '../components/admin-page-layout';

export const AdminSettingsPage = () => {
  const { pathname } = useLocation();

  return (
    <AdminPageLayout
      breadCrumbList={[{ title: 'App Settings', href: pathname }]}
    >
      <Link to={`${pathname}/location`}>Location Settings</Link>
      <br />
      <Link to={`${pathname}/area`}>Area Settings</Link>
    </AdminPageLayout>
  );
};

export default AdminSettingsPage;
