import { BrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

interface AppRouterProps {
  basename?: string;
  children: React.ReactNode;
  history: BrowserHistory;
}

export const AppRouter = ({ basename, children, history }: AppRouterProps) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export default AppRouter;

export const withAppRouter =
  <P extends object>(
    Component: React.ComponentType<P>,
    history: BrowserHistory
  ): React.FC<P> =>
  ({ ...props }) => {
    return (
      <AppRouter history={history}>
        <Component {...(props as P)} />
      </AppRouter>
    );
  };
