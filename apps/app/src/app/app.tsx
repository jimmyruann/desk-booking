import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useRoutes } from 'react-router';
import { ApiClientProvider } from '../shared/context/ApiClient';
import { AuthenticationProvider } from '../shared/context/Authentication';
import { appRoutes } from './routes';

const myQueryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnWindowFocus: false,
  //   },
  // },
});

export function App() {
  const routes = useRoutes(appRoutes);
  return (
    <QueryClientProvider client={myQueryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ApiClientProvider>
        <AuthenticationProvider>
          <MantineProvider withNormalizeCSS withGlobalStyles>
            <NotificationsProvider>{routes}</NotificationsProvider>
          </MantineProvider>
        </AuthenticationProvider>
      </ApiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
