import { createStyles } from '@mantine/core';
import React from 'react';
import convert from 'react-from-dom';
import { useTestMapContext } from './test-map-context';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestMapAreasProps {
  areaHtmlId?: string;
  svg: SVGSVGElement;
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

export const TestMapAreas = ({
  areaHtmlId = 'areas',
  svg,
  ...props
}: TestMapAreasProps) => {
  const { classes, cx } = useStyles();
  const testMapContext = useTestMapContext();

  const areas = svg.getElementById(areaHtmlId);
  if (!areas && !(areas instanceof Element)) return null;

  const convertedAreas = convert(areas);

  if (React.isValidElement(convertedAreas)) {
    if (convertedAreas.props['children']) {
      const newChildren = React.Children.map(
        convertedAreas.props['children'],
        (child) => {
          const childId =
            React.isValidElement(child) && child.props['id']
              ? child.props['id']
              : '';
          const currentActive = testMapContext.currentId === childId;
          const currentDisabled = testMapContext.disabledIds.includes(childId);
          const currentUnavailable =
            testMapContext.unavailableIds.includes(childId);

          let className = classes.common;

          if (childId.includes('desk')) {
            className = cx(className, classes.desk);
          }
          if (childId.includes('room')) {
            className = cx(className, classes.room);
          }
          if (currentActive) {
            className = cx(className, classes.active);
          }
          if (currentUnavailable) {
            className = cx(className, classes.unavailable);
          }

          if (currentDisabled) className = '';

          return React.cloneElement(child, {
            className,
            onClick: (event) =>
              testMapContext.setCurrentId(event.currentTarget.id || ''),
          });
        }
      );

      return <g {...props}>{newChildren}</g>;
    }
  }
  return <g {...props}></g>;
};
