import { Anchor, Breadcrumbs, Paper, Space } from '@mantine/core';
import { Link } from 'react-router-dom';

interface AdminPageLayoutProps {
  children?: React.ReactNode;
  breadCrumbList?: { title: string; href: string }[];
  withBreadCrumb?: boolean;
}

export const AdminPageLayout = ({
  children,
  breadCrumbList = [],
  withBreadCrumb = true,
}: AdminPageLayoutProps) => {
  const defaultList = [{ title: 'Admin', href: '/admin' }];

  const items = [...defaultList, ...breadCrumbList].map((item, i) => (
    <Anchor component={Link} to={item.href} key={i}>
      {item.title}
    </Anchor>
  ));

  const breadCrumbs = (
    <>
      <Paper shadow="xs" p="md" data-testid="breadcrumb">
        <Breadcrumbs>{items}</Breadcrumbs>
      </Paper>
      <Space h="lg" />
    </>
  );

  return (
    <>
      {withBreadCrumb && breadCrumbs}
      <Paper shadow="xs" p="md">
        {children}
      </Paper>
    </>
  );
};

export default AdminPageLayout;
