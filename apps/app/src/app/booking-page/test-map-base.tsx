import convert from 'react-from-dom';

interface TestMapBaseProps {
  baseHtmlId?: string;
  svg: SVGSVGElement;
}

export const TestMapBase = ({ baseHtmlId = 'base', svg }: TestMapBaseProps) => {
  const base = svg.getElementById(baseHtmlId);
  if (!base && !(base instanceof Element)) return null;
  return <>{convert(base)}</>;
};
