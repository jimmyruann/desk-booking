// import { render } from '@testing-library/react';
// import TestMapAreas from './test-map-areas';
// import { TestMapContext } from './test-map-context';

// describe('TestMapAreas', () => {
//   const mockSvg = (
//     <svg>
//       <g id="base"></g>
//       <g id="areas"></g>
//     </svg>
//   );

//   it('should render correctly', () => {
//     const setCurrentIdMock = jest.fn();

//     const svgContainer = render(mockSvg);

//     const container = render(
//       <TestMapContext.Provider
//         value={{
//           currentId: '',
//           setCurrentId: setCurrentIdMock,
//           disabledIds: [],
//           unavailableIds: [],
//         }}
//       >
//         <TestMapAreas svg={svgContainer as any} />
//       </TestMapContext.Provider>
//     );
//   });
// });
