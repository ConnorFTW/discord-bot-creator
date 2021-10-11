import PropTypes from 'prop-types';
import { createContext, useContext, useState } from "react";

export const ControlsContext = createContext(null);
export const useControls = () => useContext(ControlsContext);

export default function ControlsContextProvider({ children }) {
  const [state, setState] = useState({
    isStarting: false,
    isStopping: false,
    isSaving: false,
  });

  return (
    <ControlsContext.Provider value={[state, setState]}>
      {children}
    </ControlsContext.Provider>
  );
}

ControlsContextProvider.propTypes = {
  children: PropTypes.element
};
