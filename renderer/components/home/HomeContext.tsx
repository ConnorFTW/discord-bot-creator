import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

type HomeContextType = {
  folders: Array<string>;
  removeFolder: (folder: string) => void;
  addFolder: (folder: string) => void;
  setFolders: (folders: Array<string>) => void;
};

const HomeContext = createContext<HomeContextType>({
  folders: [],
  removeFolder: (): void => {},
  addFolder: (): void => {},
  setFolders: (): void => {},
});

export function useHomeContext(): HomeContextType {
  return useContext(HomeContext);
}

export function HomeProvider({ children }): JSX.Element {
  const [state, setState] = useState({
    folders: [],
  });

  const setFolders = (folders: Array<string>): void => {
    setState({
      ...state,
      folders,
    });
  };
  const removeFolder = (folder: string): void => {
    setState({
      ...state,
      folders: state.folders.filter((f) => f !== folder),
    });
  };

  const addFolder = (folder: string) => {
    setState({
      ...state,
      folders: [...state.folders, folder],
    });
  };

  useEffect((): (() => void) => {
    if (!ipcRenderer) {
      throw new Error('ipcRenderer is not defined');
    }
    ipcRenderer.on('directoryDialog', (_e, folder: string) => {
      if (!folder) return;
      addFolder(folder);
    });

    ipcRenderer.on('getLastDirectories', (_e, folders: string[]) => {
      setFolders(folders);
    });

    ipcRenderer.send('getLastDirectories');
    return (): void => {
      ipcRenderer.removeAllListeners('directoryDialog');
      ipcRenderer.removeAllListeners('getLastDirectory');
    };
  }, [JSON.stringify(state.folders)]);

  return (
    <HomeContext.Provider
      value={{ ...state, removeFolder, addFolder, setFolders }}
    >
      {children}
    </HomeContext.Provider>
  );
}

HomeProvider.propTypes = {
  children: PropTypes.element,
};
