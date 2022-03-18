import { Loading } from '@desk-booking/ui';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { ReactSVG } from 'react-svg';
import MapArea from './map-area';
import { Node } from './svg-node';

/* eslint-disable-next-line */
export interface MapBoxProps {
  htmlIdHook: [string, (htmlId: string) => void];
  mapUrl: string;
  mapAreaChildren?: Node[];
  httpRequestWithCredentials?: boolean;
  className?: string;
}

export function MapBox({
  htmlIdHook,
  mapUrl,
  mapAreaChildren,
  ...props
}: MapBoxProps) {
  const [currentId, setCurrentId] = htmlIdHook;

  const renderMap = (
    <MapArea
      nodeChildren={
        mapAreaChildren && mapAreaChildren.length ? mapAreaChildren : []
      }
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
      src={mapUrl}
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
