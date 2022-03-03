import { QueryClient, QueryClientProvider } from 'react-query';

const myQueryClient = new QueryClient();

interface MyQueryClientProvider {
  children: React.ReactChild;
}

export const MyQueryClientProvider = ({ children }: MyQueryClientProvider) => {
  return (
    <QueryClientProvider client={myQueryClient}>{children}</QueryClientProvider>
  );
};
