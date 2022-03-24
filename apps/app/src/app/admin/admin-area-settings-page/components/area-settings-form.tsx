import { Text } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useQuery } from 'react-query';

interface AreaSettingsFormProps {
  htmlId: string;
}

export const AreaSettingsForm = ({
  htmlId,
  ...props
}: AreaSettingsFormProps) => {
  const getAreaData = useQuery(
    ['GET_AREA_DATA', htmlId] as const,
    async ({ queryKey }) => {
      const htmlId = queryKey[1];
      return 'ligma';
    }
  );

  const form = useForm({
    initialValues: {},
  });

  return (
    <form {...props}>
      <Text>
        Currently Selected Area: <b>{htmlId || '-'}</b>
      </Text>
    </form>
  );
};

export default AreaSettingsForm;
