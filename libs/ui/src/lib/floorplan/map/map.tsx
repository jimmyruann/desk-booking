import { useEffect, useMemo, useRef, useState } from 'react';
import SVGNode, { Node } from '../svgnode/svgnode';
import './map.module.css';

import * as d3 from 'd3';
import _ from 'lodash';
import SVGNodeArea from '../svgnode-area/svgnode-area';

/* eslint-disable-next-line */
export interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  mapData: Node;
  viewBox: number[];
  currentHtmlId: string;
  setCurrentHtmlId: (currentHtmlId: string) => void;
}

export function Map({
  mapData,
  viewBox,
  currentHtmlId,
  setCurrentHtmlId,
  ...props
}: MapProps) {
  const mapSvgRef = useRef<SVGSVGElement>();
  const mapGRef = useRef<SVGGElement>();

  const base = useMemo(
    () => (
      <SVGNode
        node={_.find(mapData.children, { attributes: { id: 'base' } })}
      />
    ),
    [mapData]
  );

  const areas = useMemo(
    () => _.find(mapData.children, { attributes: { id: 'areas' } }),
    [mapData]
  );

  useEffect(() => {
    // https://observablehq.com/@d3/zoom?collection=@d3/d3-zoom
    if (mapSvgRef.current && mapGRef.current && viewBox.length === 4) {
      const [vBx, vBy, vBw, vBh] = viewBox;

      const svg = d3.select(mapSvgRef.current).attr('viewBox', viewBox);
      const g = d3.select(mapGRef.current);

      const zoom = d3
        .zoom()
        .extent([
          [+vBx, +vBy],
          [+vBw, +vBh],
        ])
        .scaleExtent([1, 2.5])
        .on('zoom', ({ transform }) => {
          const translate = [
            Math.min(0, Math.max(transform.x, +vBw - +vBw * transform.k)),
            Math.min(0, Math.max(transform.y, +vBh - +vBh * transform.k)),
          ];

          g.attr('transform', `translate(${translate}) scale(${transform.k})`);
        });

      svg.call(zoom);
    }
  }, [mapData, viewBox]);

  return (
    <div {...props}>
      <svg ref={mapSvgRef}>
        <g ref={mapGRef}>
          {base}
          {areas &&
            areas.children.map((node, i) => (
              <SVGNodeArea
                key={i}
                node={node}
                areaType={
                  node.attributes['id'] &&
                  node.attributes['id'].includes('desk')
                    ? 'desk'
                    : node.attributes['id'].includes('room')
                    ? 'room'
                    : null
                }
                currentHtmlId={currentHtmlId}
                setCurrentHtmlId={setCurrentHtmlId}
              />
            ))}
        </g>
      </svg>
    </div>
  );
}

export default Map;
