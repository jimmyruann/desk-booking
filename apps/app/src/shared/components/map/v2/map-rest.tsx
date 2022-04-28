import convert from 'react-from-dom/lib';
import { MapCommonProps } from './types';

export const MapRest = ({ svgMap, useHtmlId }: MapCommonProps) => {
  const mapRest = Array.from(svgMap.children)
    .map((child) => {
      if (child.id !== 'areas') return convert(child);
      return null;
    })
    .filter((n) => n);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{mapRest}</>;
};
