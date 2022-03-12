import { render } from '@testing-library/react';

import SVGNodeArea from './svgnode-area';

describe('SVGNodeArea', () => {
  const svgJson = {
    type: 'element',
    name: 'svg',
    attributes: { viewBox: '0 0 100 100', width: '100', height: '100' },
    value: '',
    children: [
      {
        type: 'element',
        name: 'circle',
        attributes: {
          r: '15',
          'data-name': 'stroke',
          'stroke-linecap': 'round',
          id: 'desk-1',
        },
        value: '',
      },
    ],
  };

  it('should render successfully', () => {
    const { baseElement } = render(
      <svg>
        <SVGNodeArea
          node={svgJson.children[0]}
          areaType="desk"
          currentHtmlId=""
          setCurrentHtmlId={(v: string) => null}
        />
      </svg>
    );
    expect(baseElement).toBeTruthy();
  });
});
