import { LoginReturn, RefreshTokenReturn } from '@desk-booking/data';
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

const AuthenticationContext = React.createContext<AuthenticationContext>({
  isLoading: true,
  user: null,
  setUser: (user: User) => null,
  login: async (loginCred: { email: string; password: string }) =>
    new Promise((resolve) => resolve([false, null])),
  logout: () => null,
});

export const useAuth = () => React.useContext(AuthenticationContext);
export const AuthenticationProvider = ({
  children,
}: AuthenticationProvider) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const api = useApi();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.client.post<RefreshTokenReturn>(
          '/auth/refresh',
          null,
          {
            skipAuthRefresh: true,
          } as AxiosAuthRefreshRequestConfig
        );
        if (response.data) {
          api.saveAccessToken(response.data.access_token);
          setUser(response.data.user);
        }
      } catch (error) {
        return;
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [api]);

  const loginMutation = useMutation(
    (data: { email: string; password: string }) => {
      return api.client.post<LoginReturn>('/auth/login', data, {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig);
    },
    {
      onSuccess: (response) => {
        api.saveAccessToken(response.data.access_token);
        setUser(response.data.user);
        // setIsLoggedIn(true);
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
        setUser(null);
        api.saveAccessToken(null);
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
        // isLoggedIn,
        // setIsLoggedIn,
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
