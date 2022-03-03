import { ActionIcon, Alert, Header, Title } from '@mantine/core';
import { HiX } from 'react-icons/hi';
import { useGlobalMessage } from '../../context/GlobalMessage';
import './app-header.module.css';

/* eslint-disable-next-line */
export interface AppHeaderProps {}

export function AppHeader(props: AppHeaderProps) {
  const globalMessage = useGlobalMessage();

  return (
    <div>
      <Header
        height={60}
        padding="xs"
        className="tw-flex tw-items-center tw-justify-between"
      >
        <Title order={4}>Desk Booking Service</Title>
      </Header>
      <div role="alert">
        {globalMessage.message && (
          <Alert color="blue" variant="light">
            <div className="tw-flex tw-justify-between tw-items-center">
              <span>{globalMessage.message}</span>
              <ActionIcon
                variant="transparent"
                color="indigo"
                onClick={() => globalMessage.setMessage('')}
              >
                <HiX size={20} />
              </ActionIcon>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default AppHeader;
