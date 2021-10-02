import { createContext, useContext } from "react";

export const ControlsContext = createContext(null);
export const useControls = () => useContext(ControlsContext);

export default function ControlsContextProvider({ children }) {
  const [state, setState] = useState({
    isRunning: false,
    isStopping: false,
    isSaving: false,
  });

  return (
    <ControlsContext.Provider value={[state, setState]}>
      {children}
    </ControlsContext.Provider>
  );
}
