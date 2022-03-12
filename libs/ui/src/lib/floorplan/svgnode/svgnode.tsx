import React from 'react';
import { translate } from 'html-attribute-react';
import './svgnode.module.css';

export interface Node {
  name: string;
  type: string;
  value: string;
  attributes: Record<string, string>;
  children?: Node[];
}

export interface SVGNodeProps extends React.HTMLProps<HTMLElement> {
  node: Node;
}

export function SVGNode({ node, children, ...props }: SVGNodeProps) {
  if (node.type === 'text') return <text>{node.value}</text>;
  const renderNodeChildren =
    node.children && node.children.length
      ? node.children.map((node, i) => <SVGNode node={node} key={i} />)
      : null;

  return React.createElement(
    node.name,
    { ...translate(node.attributes), ...props },
    renderNodeChildren
  );
}

export default SVGNode;
