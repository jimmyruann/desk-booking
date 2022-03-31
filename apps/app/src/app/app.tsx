import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useRoutes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticationProvider } from '../shared/context/Authentication.context';
import { appRoutes } from './routes';

const myQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

const withBrowserRouter =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  ({ ...props }) => {
    return (
      <BrowserRouter>
        <Component {...(props as P)} />
      </BrowserRouter>
    );
  };

export function App() {
  const routes = useRoutes(appRoutes);
  return (
    <QueryClientProvider client={myQueryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <ApiClientProvider> */}
      <AuthenticationProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <NotificationsProvider>{routes}</NotificationsProvider>
        </MantineProvider>
      </AuthenticationProvider>
      {/* </ApiClientProvider> */}
    </QueryClientProvider>
  );
}

export default withBrowserRouter(App);
