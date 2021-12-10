import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { styled } from '../../../stitches.config';
import { useHomeContext } from '../HomeContext';
import FolderCard from './Card';

const List = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  width: '100%',
  height: '100%',
  backgroundColor: '$gray-200',
  overflow: 'auto',
  padding: '0px',
  margin: '0px',
  listStyle: 'none',
  gap: '3rem',
});

type FolderListProps = {
  setSettings: (folder: any) => void;
};

export default function FolderList({ setSettings }: FolderListProps) {
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
      <List>
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder} setSettings={setSettings} />
        ))}
      </List>
    </>
  );
}
