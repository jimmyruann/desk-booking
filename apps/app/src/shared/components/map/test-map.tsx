import axios from 'axios';
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import MapBoxSkeleton from './map-skeleton';
import { TestMapAreas } from './test-map-areas';
import { TestMapBase } from './test-map-base';

interface TestMapProps {
  mapUrl: string;
  children?: React.ReactNode;
  withZoom?: boolean;
}

const parser = new DOMParser();

const getSvgMap = async (mapUrl: string) => {
  const { data } = await axios.get<string>(mapUrl);
  return data;
};

const useSvgMap = (mapUrl: string) => {
  return useQuery(
    ['svgMap', mapUrl],
    async () => {
      const data = await getSvgMap(mapUrl);
      const parsedSvg = parser.parseFromString(data, 'image/svg+xml');

      const svgList = parsedSvg.getElementsByTagName('svg');
      if (!svgList.length) throw new Error('Invalid SVG fetched from URL.');

      return svgList[0];
    },
    {
      staleTime: Infinity,
    }
  );
};

export const TestMap = ({
  children,
  mapUrl,
  withZoom = true,
  ...props
}: TestMapProps) => {
  const svgRef = useRef<SVGSVGElement>();
  const gRef = useRef<SVGGElement>();

  const { data: svgElement, status, isLoading } = useSvgMap(mapUrl);

  // Zoom function
  useEffect(() => {
    if (withZoom) {
      if (!isLoading && svgElement && svgRef.current && gRef.current) {
        const viewBox = svgElement.getAttribute('viewBox');
        const [vBx, vBy, vBw, vBh] = viewBox;

        const svg = d3.select(svgRef.current);
        const g = d3.select(gRef.current);

        svg.call(
          d3
            .zoom()
            .extent([
              [0, 0],
              [+vBw, +vBh],
            ])
            .scaleExtent([1, 3])
            .on('zoom', ({ transform }) => {
              g.attr('transform', transform);
            })
        );
      }
    }
  });

  if (status === 'loading') return <MapBoxSkeleton />;
  if (status === 'error') return <div>Unable to load the map.</div>;

  return (
    <svg ref={svgRef} viewBox={svgElement.getAttribute('viewBox')} {...props}>
      <g ref={gRef}>
        <TestMapBase svg={svgElement} />
        <TestMapAreas svg={svgElement} />
      </g>
    </svg>
  );
};

export default TestMap;
