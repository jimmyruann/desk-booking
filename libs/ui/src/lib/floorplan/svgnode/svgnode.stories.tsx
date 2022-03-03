import { Story, Meta } from '@storybook/react';
import { SVGNode } from './svgnode';

export default {
  component: SVGNode,
  title: 'SVGNode',
} as Meta;

const Template: Story = (args) => <SVGNode {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
