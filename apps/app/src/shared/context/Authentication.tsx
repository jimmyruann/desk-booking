import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useApi } from './ApiClient';

interface AuthenticationContext {
  isLoading: boolean;
  user: Omit<User, 'password'>;
  setUser: (user: User) => void;
  login: (loginCred: {
    email: string;
    password: string;
  }) => Promise<[boolean, string | null]>;
  logout: () => void;
}

interface AuthenticationProvider {
  children: React.ReactChild;
}

const AuthenticationContext = React.createContext<AuthenticationContext>(null);

export const useAuth = () => React.useContext(AuthenticationContext);
export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  const refreshSession = useMutation(
    () => {
      // <RefreshTokenResponse>
      return api.client.post('/auth/refresh', null, {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig);
    },
    {
      onSuccess: ({ data }) => {
        api.saveAccessToken(data.access_token);
        setUser(data.user);
      },
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    // https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
    let cancel = false;

    if (!user || cancel) {
      refreshSession.mutate();
    }

    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginMutation = useMutation(
    (data: { email: string; password: string }) => {
      // <LoginResponse>
      return api.client.post('/auth/login', data, {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig);
    },
    {
      onSuccess: (response) => {
        api.saveAccessToken(response.data.access_token);
        setUser(response.data.user);
      },
    }
  );

  const logoutMutation = useMutation(
    async () => {
      return await api.client.get('/auth/logout', {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig);
    },
    {
      onSettled: () => {
        api.saveAccessToken(null);
        setUser(null);
        setIsLoading(false);
      },
    }
  );

  const login = async (loginCred: {
    email: string;
    password: string;
  }): Promise<[boolean, string | null]> => {
    try {
      await loginMutation.mutateAsync(loginCred);
      return [true, null];
    } catch (error) {
      const err = error as AxiosError;
      return [false, err.response.data.message || err.message];
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        user,
        setUser,
        login,
        logout: () => logoutMutation.mutate(),
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
