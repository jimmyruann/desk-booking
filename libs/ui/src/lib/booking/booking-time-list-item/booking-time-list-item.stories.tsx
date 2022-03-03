import { Story, Meta } from '@storybook/react';
import { BookingTimeListItem } from './booking-time-list-item';

export default {
  component: BookingTimeListItem,
  title: 'BookingTimeListItem',
} as Meta;

const Template: Story = (args) => <BookingTimeListItem {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
