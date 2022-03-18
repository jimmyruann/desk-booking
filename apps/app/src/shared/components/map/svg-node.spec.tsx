import { render } from '@testing-library/react';
import SVGNode from './svg-node';

describe('SVGNode Component', () => {
  it('should render successfully', () => {
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
          },
          value: '',
        },
      ],
    };
    const rendered = render(<SVGNode node={svgJson} />);

    expect(rendered.baseElement).toBeTruthy();
    expect(rendered.baseElement.innerHTML).toContain(
      '<svg height="100" width="100" viewBox="0 0 100 100"><circle stroke-linecap="round" data-name="stroke" r="15"></circle></svg>'
    );
  });
});
