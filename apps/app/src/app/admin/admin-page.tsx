import { Container } from '@mantine/core';
import AdminPageLayout from './components/admin-page-layout';

export function AdminPage() {
  return (
    <AdminPageLayout>
      <Container fluid>Admin dashboard</Container>
    </AdminPageLayout>
  );
}

export default AdminPage;
