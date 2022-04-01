import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useRoutes } from 'react-router';
import { withAppRouter } from '../shared/components/app-router/app-router';
import appRouterHistory from '../shared/components/app-router/app-router-history';
import { AuthenticationProvider } from '../shared/context/Authentication.context';
import { appRoutes } from './routes';

const myQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export function App() {
  const routes = useRoutes(appRoutes);
  return (
    <QueryClientProvider client={myQueryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthenticationProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <NotificationsProvider>{routes}</NotificationsProvider>
        </MantineProvider>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default withAppRouter(App, appRouterHistory);
