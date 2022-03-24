import React from 'react';

interface TestMapContextProps {
  currentId: string;
  setCurrentId: (currentId: string) => void;
  disabledIds: string[];
  unavailableIds: string[];
}

export const TestMapContext = React.createContext<TestMapContextProps>(null);
export const useTestMapContext = () => React.useContext(TestMapContext);
