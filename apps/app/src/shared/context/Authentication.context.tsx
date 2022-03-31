import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { axiosApiClient, saveAccessToken } from '../api';
// import { useApi } from './ApiClient';

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

const AuthenticationContext = React.createContext<AuthenticationContext>(null);
export const useAuth = () => React.useContext(AuthenticationContext);

interface LoginCredProps {
  email: string;
  password: string;
}

const refreshSessionRequest = async () => {
  const { data } = await axiosApiClient.post('/auth/refresh', null, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);

  return data;
};

const loginRequest = async (loginCred: LoginCredProps) => {
  const { data } = await axiosApiClient.post('/auth/login', loginCred, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);

  return data;
};

const logoutRequest = async () => {
  const { data } = await axiosApiClient.get('/auth/logout', {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
  return data;
};

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  const refreshSessionMutation = useMutation(refreshSessionRequest, {
    onSuccess: (data) => {
      saveAccessToken(data.access_token);
      setUser(data.user);
    },
  });

  const loginMutation = useMutation(loginRequest, {
    onSuccess: (data) => {
      saveAccessToken(data.access_token);
      setUser(data.user);
    },
  });

  const logoutMutation = useMutation(logoutRequest, {
    onSettled: () => {
      saveAccessToken(null);
      setUser(null);
    },
  });

  useEffect(() => {
    // https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
    let cancel = false;

    if (!user || cancel) refreshSessionMutation.mutate();

    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (
    loginCred: LoginCredProps
  ): Promise<[boolean, string | null]> => {
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
        isLoading:
          refreshSessionMutation.isLoading ||
          loginMutation.isLoading ||
          logoutMutation.isLoading,
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
