import { UserEntity } from '@desk-booking/data';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import React from 'react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from 'react-query';
import { axiosApiClient } from '../api';
// import { useApi } from './ApiClient';

interface AuthenticationContext {
  isLoading: boolean;
  user: Omit<User, 'password'>;
  login: UseMutationResult<UserEntity, AxiosError, LoginCredProps, unknown>;
  logout: () => void;
}

const AuthenticationContext = React.createContext<AuthenticationContext>(null);
export const useAuth = () => React.useContext(AuthenticationContext);

interface LoginCredProps {
  email: string;
  password: string;
}

const getMe = async () => {
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
  const queryClient = useQueryClient();

  const { data: user, status } = useQuery('me', getMe, {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation<UserEntity, AxiosError, LoginCredProps>(
    loginRequest,
    {
      onSettled: () => {
        queryClient.invalidateQueries(['me']);
      },
    }
  );

  const logoutMutation = useMutation(logoutRequest, {
    onSettled: () => {
      queryClient.removeQueries(['me']);
    },
  });

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        login: loginMutation,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
