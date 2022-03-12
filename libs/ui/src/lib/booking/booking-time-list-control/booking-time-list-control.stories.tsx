import { Story, Meta } from '@storybook/react';
import { BookingTimeListControl } from './booking-time-list-control';

export default {
  component: BookingTimeListControl,
  title: 'BookingTimeListControl',
} as Meta;

const Template: Story = (args) => <BookingTimeListControl {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
