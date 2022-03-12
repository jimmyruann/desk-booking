import './notification.module.css';
import { Notification as N } from '@mantine/core';
import { HiCheck, HiX } from 'react-icons/hi';

export interface NotificationContent {
  message: string;
  isError?: boolean;
}

/* eslint-disable-next-line */
export interface NotificationProps extends NotificationContent {
  onClose: (content: NotificationContent) => void;
}

export function Notification({ message, isError, onClose }: NotificationProps) {
  return (
    <N
      icon={isError ? <HiX /> : <HiCheck />}
      color={isError ? 'red' : 'teal'}
      onClose={() => onClose({ message: '', isError: false })}
      className="tw-w-full"
    >
      {message}
    </N>
  );
}

export default Notification;
