import { SerializedStyles } from '@emotion/react';

export type UseHtmlIdFn = () => [string, (value: string) => void];

export interface MapCommonProps {
  svgMap: SVGSVGElement;
  useHtmlId: UseHtmlIdFn;
}

export interface MapAreaStyleProps {
  common?: SerializedStyles;
  active?: SerializedStyles;
  disabled?: SerializedStyles;
  unavailable?: SerializedStyles;
}
