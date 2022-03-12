import { Story, Meta } from '@storybook/react';
import { BookingTimeList } from './booking-time-list';

export default {
  component: BookingTimeList,
  title: 'BookingTimeList',
} as Meta;

const Template: Story = (args) => <BookingTimeList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
