import { Story, Meta } from '@storybook/react';
import { Loading } from './loading';

export default {
  component: Loading,
  title: 'Loading',
} as Meta;

const Template: Story = (args) => <Loading {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
