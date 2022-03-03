import { Story, Meta } from '@storybook/react';
import { BookingTable } from './booking-table';

export default {
  component: BookingTable,
  title: 'BookingTable',
} as Meta;

const Template: Story = (args) => <BookingTable {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
