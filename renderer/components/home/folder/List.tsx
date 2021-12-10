import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useHomeContext } from '../HomeContext';
import FolderCard from './Card';

type FolderListType = {
  setSettings: (folder: any) => void;
};

export default function FolderList({
  setSettings,
}: FolderListType): JSX.Element {
  const { addFolder, setFolders, folders } = useHomeContext();
  useEffect(() => {
    ipcRenderer.on('directoryDialog', (_e, folder) => {
      if (!folder) return;
      addFolder(folder);
    });

    ipcRenderer.on('getLastDirectories', (_e, folders) => {
      setFolders(folders);
    });

    ipcRenderer.send('getLastDirectories');
    return () => {
      ipcRenderer.removeAllListeners('directoryDialog');
      ipcRenderer.removeAllListeners('getLastDirectory');
    };
  }, [JSON.stringify(folders)]);

  if (!folders?.[0]) return null;

  return (
    <>
      {folders.map((folder) => (
        <FolderCard folder={folder} key={folder} setSettings={setSettings} />
      ))}
    </>
  );
}
