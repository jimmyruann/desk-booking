import { Loading } from '@desk-booking/ui';
import axios from 'axios';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import { ReactSVG } from 'react-svg';
import MapArea from './map-area';
import { Node } from './svg-node';

/* eslint-disable-next-line */
export interface MapBoxProps {
  htmlIdHook: [string, (htmlId: string) => void];
  // mapUrl: string;
  // mapAreaChildren?: Node[];
  locationId: string;
  httpRequestWithCredentials?: boolean;
  className?: string;
}

const assetBaseUrl = '/assets/floorplan';

export function MapBox({
  htmlIdHook,
  // mapUrl,
  // mapAreaChildren,
  locationId,
  ...props
}: MapBoxProps) {
  const [currentId, setCurrentId] = htmlIdHook;

  const getSvgMapAreas = useQuery(
    ['GET_SVG_MAP_AREAS', locationId],
    async ({ queryKey }) => {
      const locationId = queryKey[1];
      const { data } = await axios
        .create({ baseURL: assetBaseUrl })
        .get<Node>(`/${locationId}/areas.json`);

      return data.children || [];
    }
  );

  const renderMap = getSvgMapAreas.status === 'success' && (
    <MapArea
      nodeChildren={getSvgMapAreas.data}
      handleClick={setCurrentId}
      currentId={currentId}
      unavailable={['sydney-lv16-room-13']}
    />
  );

  const beforeInjection = (svg: SVGSVGElement) => {
    // Wrap all SVG content in <g> for zooming
    const wrapperG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrapperG.append(...(svg.childNodes as any));

    // add zoom functions
    addZoom(svg, wrapperG);

    // render map desk, rooms and behaviours
    const areaG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Remove border when clicked
    areaG.style.outline = 'none';

    // Add areas JSON data and behavior into SVG
    ReactDOM.render(renderMap, areaG);

    wrapperG.appendChild(areaG);
    svg.appendChild(wrapperG);
  };

  return (
    <ReactSVG
      src={`${assetBaseUrl}/${locationId}/map.svg`}
      beforeInjection={beforeInjection}
      loading={() => <Loading />}
      fallback={() => <div>Unable to load map</div>}
      {...props}
    />
  );
}

function addZoom(svg: SVGSVGElement, gWrapper: SVGGElement) {
  const viewBox = svg.getAttribute('viewBox').split(' ');
  if (viewBox.length === 4) {
    const [vBx, vBy, vBw, vBh] = viewBox;
    const currentSvg = d3.select(svg);
    const currentG = d3.select(gWrapper);
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
        currentG.attr(
          'transform',
          `translate(${translate}) scale(${transform.k})`
        );
      });
    currentSvg.call(zoom);
  }
}

export default MapBox;
