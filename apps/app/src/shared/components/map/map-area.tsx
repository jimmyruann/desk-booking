import { createStyles } from '@mantine/core';
import { Node, SVGNode } from './svg-node';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MapAreaProps {
  nodeChildren: Node[];
  currentId: string;
  disabled?: string[];
  unavailable?: string[];
  handleClick: (htmlId: string) => void;
}

const useStyles = createStyles((theme) => ({
  g: {
    outline: 'none',
  },
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
  unavailable: {
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

export const MapArea = ({
  nodeChildren,
  currentId,
  disabled = [],
  unavailable = [],
  handleClick,
  ...props
}: MapAreaProps) => {
  const { classes, cx } = useStyles();

  const renderChildren = nodeChildren.map((child, i) => {
    let className = classes.common;
    const currentActive = currentId === child.attributes['id'];
    const currentDisabled = disabled.includes(child.attributes['id']);
    const currentUnavailable = unavailable.includes(child.attributes['id']);

    if (child.attributes['id'].includes('desk')) {
      className = cx(className, classes.desk);
    }
    if (child.attributes['id'].includes('room')) {
      className = cx(className, classes.room);
    }
    if (currentActive) {
      className = cx(className, classes.active);
    }

    if (currentUnavailable) {
      className = cx(className, classes.unavailable);
    }

    if (currentDisabled) className = '';

    return (
      <SVGNode
        key={i}
        node={child}
        className={className}
        onClick={(event) =>
          event.currentTarget.id &&
          !currentUnavailable &&
          handleClick(event.currentTarget.id)
        }
        disabled={currentDisabled}
        data-unavailable={currentUnavailable}
        {...props}
      />
    );
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{renderChildren}</>;
};

export default MapArea;
