import { Story, Meta } from '@storybook/react';
import { SVGNodeArea } from './svgnode-area';

export default {
  component: SVGNodeArea,
  title: 'SVGNodeArea',
} as Meta;

const Template: Story = (args) => <SVGNodeArea {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
