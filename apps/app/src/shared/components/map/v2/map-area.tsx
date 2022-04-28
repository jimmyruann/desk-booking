import { ClassNames, css } from '@emotion/react';
import { useMantineTheme } from '@mantine/core';
import React from 'react';
import { MapAreaStyleProps } from './types';

interface MapAreaProps {
  type: keyof React.ReactSVG;
  active?: boolean;
  disabled?: boolean;
  unavailable?: boolean;
  title?: string;
  styles?: MapAreaStyleProps;
}

export const MapArea: React.FC<
  MapAreaProps &
    React.HTMLProps<
      SVGPathElement | SVGCircleElement | SVGRectElement | SVGPolygonElement
    >
> = ({ type, active, disabled, unavailable, title, styles, ...props }) => {
  const theme = useMantineTheme();

  const defaultStyle = {
    common:
      (styles && styles.common) ||
      css({
        opacity: '0.3',
        fill: theme.colors.green[3],
        ':hover': {
          fill: theme.colors.green[5],
          cursor: 'pointer',
        },
      }),
    active:
      (styles && styles.active) ||
      css({
        opacity: '0.3',
        fill: theme.colors.blue[5],
        ':hover': {
          fill: theme.colors.blue[5],
          cursor: 'default',
        },
      }),
    unavailable:
      (styles && styles.unavailable) ||
      css({
        opacity: '0.3',
        fill: theme.colors.red[5],
        pointerEvents: 'none',
        cursor: 'default',
        ':hover': {
          fill: theme.colors.red[5],
        },
      }),
    disabled:
      (styles && styles.disabled) ||
      css({
        fill: 'none',
        pointerEvents: 'none',
        cursor: 'default',
      }),
  };

  let className = defaultStyle.common;

  if (active) className = defaultStyle.active;
  if (unavailable) className = defaultStyle.unavailable;
  if (disabled) className = defaultStyle.disabled;

  return (
    <g>
      {title && <title data-testid="mapAreaTitle">{title}</title>}
      <ClassNames>
        {(content) =>
          React.createElement(type, {
            className: content.css(className),
            'data-testid': 'mapArea',
            ...props,
          })
        }
      </ClassNames>
    </g>
  );
};

export default MapArea;
