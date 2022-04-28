import axios from 'axios';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import MapAreas from './map-areas';
import { MapRest } from './map-rest';
import { MapAreaStyleProps, UseHtmlIdFn } from './types';

interface MapProps {
  locationId: string;
  useHtmlId: UseHtmlIdFn;
  allowZoom?: boolean;
  styleData?: Record<string, MapAreaStyleProps>[];
  disabledIds?: string[];
  unavailableIds?: string[];
}

const parser = new DOMParser();

const getSvgMapQuery = async (locationId: string) => {
  const { data } = await axios.get<string>(
    `/assets/floorplan/${locationId}.svg`
  );

  const parsedSvg = parser.parseFromString(data, 'image/svg+xml');
  const svgList = parsedSvg.getElementsByTagName('svg');
  if (!svgList.length) throw new Error('Invalid SVG fetched from URL.');

  return svgList[0];
};

const zoomFn = (
  svgRef: React.MutableRefObject<SVGSVGElement>,
  gRef: React.MutableRefObject<SVGGElement>
) => {
  const viewBox = svgRef.current.getAttribute('viewBox');
  const [, , vBw, vBh] = viewBox;

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
};

export const Map = ({ locationId, allowZoom = true, ...props }: MapProps) => {
  const svgRef = useRef<SVGSVGElement>();
  const gRef = useRef<SVGGElement>();

  const mapSvgQuery = useQuery(
    ['map', locationId],
    () => getSvgMapQuery(locationId),
    { staleTime: Infinity }
  );

  // Zoom function
  useEffect(() => {
    if (allowZoom && !mapSvgQuery.isLoading && svgRef.current && gRef.current) {
      zoomFn(svgRef, gRef);
    }
  });

  if (mapSvgQuery.isLoading) return <div>Loading</div>;
  if (mapSvgQuery.isError) return <div>Error</div>;

  const svgProps = Object.assign(
    {},
    ...Array.from(mapSvgQuery.data.attributes, ({ name, value }) => ({
      [name]: value,
    }))
  );

  return (
    <svg {...svgProps} ref={svgRef}>
      <g ref={gRef}>
        <g id="base">
          <MapRest svgMap={mapSvgQuery.data} {...props} />
        </g>
        <g id="areas">
          <MapAreas svgMap={mapSvgQuery.data} {...props} />
        </g>
      </g>
    </svg>
  );
};

export default Map;
