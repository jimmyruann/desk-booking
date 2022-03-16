import { Loading } from '@desk-booking/ui';
import { AxiosError } from 'axios';
import './query-state-handler.module.css';

export interface QueryHandlerProps {
  status: 'idle' | 'error' | 'loading' | 'success';
  error: AxiosError;
}

/* eslint-disable-next-line */
export interface QueryStateHandlerProps extends QueryHandlerProps {
  children: React.ReactNode;
}

export function QueryStateHandler({
  children,
  status,
  error,
}: QueryStateHandlerProps) {
  if (status === 'loading') return <Loading />;
  if (status === 'error')
    return (
      <div>
        Something went wrong <br />{' '}
        {error.response.data.message || error.message}
      </div>
    );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default QueryStateHandler;
