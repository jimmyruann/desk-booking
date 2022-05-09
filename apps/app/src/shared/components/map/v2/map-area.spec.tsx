import { css } from '@emotion/react';
import { cleanup, render } from '@testing-library/react';
import MapArea from './map-area';

describe('MapArea', () => {
  beforeEach(cleanup);
  it('should render correctly', () => {
    const container = render(
      <svg>
        <MapArea
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
        />
      </svg>
    );

    expect(container.baseElement).toBeTruthy();
    expect(container.getByTestId('mapArea')).toBeTruthy();
  });

  it('should render title', () => {
    const container = render(
      <svg>
        <MapArea
          disabled
          title="Test Title"
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
        />
      </svg>
    );

    const mapAreaTitle = container.getByTestId('mapAreaTitle');
    expect(mapAreaTitle).toBeTruthy();
    expect(container.getByText('Test Title')).toBeTruthy();
  });

  it('should disable with no color', () => {
    const container = render(
      <svg>
        <MapArea
          disabled
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
        />
      </svg>
    );

    const path = container.getByTestId('mapArea');

    expect(path).toHaveStyle({
      fill: 'none',
    });
  });

  it('should have different color when unavailable', () => {
    const container = render(
      <svg>
        <MapArea
          unavailable
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
        />
      </svg>
    );
    const path = container.getByTestId('mapArea');

    expect(path).toHaveStyle({
      opacity: '0.3',
    });
  });

  it('should override all styles when disabled', () => {
    const container = render(
      <svg>
        <MapArea
          active
          unavailable
          disabled
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
        />
      </svg>
    );

    expect(container.getByTestId('mapArea')).toHaveStyle({
      fill: 'none',
    });
  });

  it('should be able to use defined styles', () => {
    const container = render(
      <svg>
        <MapArea
          type="circle"
          {...{
            cx: 50,
            cy: 50,
            r: 40,
            strokeWidth: 1,
          }}
          styles={{
            common: css({
              fill: 'black',
            }),
            active: css({
              fill: 'red',
            }),
            unavailable: css({
              fill: 'yellow',
            }),
          }}
        />
      </svg>
    );

    const path = container.getByTestId('mapArea');
    expect(path).toHaveStyle({
      fill: 'black',
    });
  });
});
