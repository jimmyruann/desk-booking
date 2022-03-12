import { Story, Meta } from '@storybook/react';
import { NotFound, NotFoundProps } from './not-found';

export default {
  component: NotFound,
  title: 'NotFound',
} as Meta;

const Template: Story<NotFoundProps> = (args) => <NotFound {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
