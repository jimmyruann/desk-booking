import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MapArea from './map-area';

describe('MapArea Component', () => {
  beforeEach(cleanup);

  it('should be able to render with empty node children', () => {
    const { baseElement } = render(
      <svg>
        <MapArea nodeChildren={[]} currentId={''} handleClick={() => null} />
      </svg>
    );

    expect(baseElement).toBeTruthy();
    expect(baseElement.innerHTML).toContain('<svg></svg>');
  });

  it('should be able to render', () => {
    const { baseElement } = render(
      <svg>
        <MapArea
          nodeChildren={[
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-29',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-29',
              },
              children: [],
            },
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-30',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.2 0.1)',
                'data-testid': 'test-desk-30',
              },
              children: [],
            },
          ]}
          currentId={''}
          handleClick={() => null}
        />
      </svg>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should be different color when currentId is current HTML Id', () => {
    render(
      <MapArea
        nodeChildren={[
          {
            name: 'path',
            type: 'element',
            value: '',
            attributes: {
              id: 'test-desk-29',
              d: 'M751.1,549.9v34h21.2v-34H751.1',
              transform: 'translate(0.3 0.4)',
              'data-testid': 'test-desk-29',
            },
            children: [],
          },
          {
            name: 'path',
            type: 'element',
            value: '',
            attributes: {
              id: 'test-desk-30',
              d: 'M751.1,549.9v34h21.2v-34H751.1',
              transform: 'translate(0.2 0.1)',
              'data-testid': 'test-desk-30',
            },
            children: [],
          },
        ]}
        currentId={'test-desk-30'}
        handleClick={() => null}
      />,
      {
        wrapper: ({ children }) => <svg>{children}</svg>,
      }
    );

    const container29 = screen.getByTestId('test-desk-29');
    const container30 = screen.getByTestId('test-desk-30');

    expect(
      window.getComputedStyle(container29).getPropertyValue('fill') !==
        window.getComputedStyle(container30).getPropertyValue('fill')
    ).toBeTruthy();
  });

  it("handleClicked should be called with target's html ID when clicked", () => {
    const handleClick = jest.fn();

    render(
      <svg>
        <MapArea
          nodeChildren={[
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-30',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-30',
              },
              children: [],
            },
          ]}
          currentId={''}
          handleClick={handleClick}
        />
      </svg>
    );

    const container = screen.getByTestId('test-desk-30');
    act(() => {
      container.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleClick).toBeCalledWith('test-desk-30');
  });

  it('should have disable attribute if in disabled list', () => {
    render(
      <svg>
        <MapArea
          nodeChildren={[
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-30',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-30',
              },
              children: [],
            },
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-31',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-31',
              },
              children: [],
            },
          ]}
          currentId={''}
          handleClick={() => null}
          disabled={['test-desk-30']}
        />
      </svg>
    );

    const container = screen.getByTestId('test-desk-30');
    const notDisabled = screen.getByTestId('test-desk-31');

    expect(container).toHaveAttribute('disabled');
    expect(notDisabled).not.toHaveAttribute('disabled');
  });

  it('should have data-unavailable attribute value if in unavailable list', () => {
    render(
      <svg>
        <MapArea
          nodeChildren={[
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-30',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-30',
              },
              children: [],
            },
            {
              name: 'path',
              type: 'element',
              value: '',
              attributes: {
                id: 'test-desk-31',
                d: 'M751.1,549.9v34h21.2v-34H751.1',
                transform: 'translate(0.3 0.4)',
                'data-testid': 'test-desk-31',
              },
              children: [],
            },
          ]}
          currentId={''}
          handleClick={() => null}
          unavailable={['test-desk-30']}
        />
      </svg>
    );

    const container = screen.getByTestId('test-desk-30');
    const isAvailable = screen.getByTestId('test-desk-31');

    expect(container).toHaveAttribute('data-unavailable', 'true');
    expect(isAvailable).toHaveAttribute('data-unavailable', 'false');
  });
});
