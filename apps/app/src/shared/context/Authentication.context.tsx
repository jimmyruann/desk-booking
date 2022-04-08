import { UserEntity } from '@desk-booking/data';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import React, { useState } from 'react';
import { useMutation, UseMutationResult, useQuery } from 'react-query';
import { axiosApiClient } from '../api';
// import { useApi } from './ApiClient';

interface AuthenticationContext {
  isLoading: boolean;
  user: Omit<User, 'password'>;
  setUser: (user: User) => void;
  login: UseMutationResult<UserEntity, AxiosError, LoginCredProps, unknown>;
  logout: () => void;
}

const AuthenticationContext = React.createContext<AuthenticationContext>(null);
export const useAuth = () => React.useContext(AuthenticationContext);

interface LoginCredProps {
  email: string;
  password: string;
}

const getUser = async () => {
  const { data } = await axiosApiClient.get<UserEntity>('/user');
  return data;
};

const loginRequest = async (loginCred: LoginCredProps) => {
  const { data } = await axiosApiClient.post<UserEntity>(
    '/auth/login',
    loginCred,
    {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig
  );

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
  const [user, setUser] = useState<UserEntity | null>(null);

  const userQuery = useQuery('me', getUser, {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const loginMutation = useMutation<UserEntity, AxiosError, LoginCredProps>(
    loginRequest,
    {
      onSuccess: (data) => {
        setUser(data);
      },
    }
  );

  const logoutMutation = useMutation(logoutRequest, {
    onSettled: () => {
      setUser(null);
    },
  });

  // const login = async (
  //   loginCred: LoginCredProps
  // ): Promise<[boolean, string | null]> => {
  //   try {
  //     await loginMutation.mutateAsync(loginCred);
  //     return [true, null];
  //   } catch (error) {
  //     const err = error as AxiosError;
  //     return [false, err.response.data.message || err.message];
  //   }
  // };

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading:
          userQuery.isLoading ||
          loginMutation.isLoading ||
          logoutMutation.isLoading,
        user,
        setUser,
        login: loginMutation,
        logout: () => logoutMutation.mutate(),
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
