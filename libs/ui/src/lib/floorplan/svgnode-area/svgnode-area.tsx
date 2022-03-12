import SVGNode, { Node } from '../svgnode/svgnode';
import { createStyles } from '@mantine/core';
import './svgnode-area.module.css';

/* eslint-disable-next-line */
export interface SVGNodeAreaProps {
  node: Node;
  areaType: 'desk' | 'room';
  disabled?: boolean;
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
}

const useStyles = createStyles((theme) => ({
  common: {
    opacity: '0.3',
    ':hover': {
      cursor: 'pointer',
    },
  },
  active: {
    fill: theme.colors.blue[5],
    ':hover': {
      fill: theme.colors.blue[5],
      cursor: 'default',
    },
  },
  disabled: {
    fill: theme.colors.red[5],
    ':hover': {
      fill: theme.colors.red[5],
      cursor: 'not-allowed',
    },
  },
  desk: {
    fill: theme.colors.green[3],
    ':hover': {
      fill: theme.colors.green[5],
    },
  },
  room: {
    fill: theme.colors.orange[3],
    ':hover': {
      fill: theme.colors.orange[5],
    },
  },
}));

export function SVGNodeArea({
  node,
  areaType,
  disabled,
  currentHtmlId,
  setCurrentHtmlId,
}: SVGNodeAreaProps) {
  const { classes, cx } = useStyles();
  const className = cx(
    classes.common,
    classes[areaType],
    currentHtmlId === node.attributes['id'] && classes.active,
    disabled && classes.disabled
  );

  return (
    <SVGNode
      node={node}
      className={className}
      onClick={() => setCurrentHtmlId(!disabled ? node.attributes['id'] : '')}
    />
  );
}

export default SVGNodeArea;
