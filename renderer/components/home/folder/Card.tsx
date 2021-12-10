import { XIcon } from '@heroicons/react/solid';
import { ipcRenderer } from 'electron';
import path from 'path';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { styled } from '../../../stitches.config';
import { useHomeContext } from '../HomeContext';
import BotIcon from './BotIcon';

const Container = styled('div', {
  backgroundColor: '#2f3136',
  border: 'none',
  borderRadius: '0.75rem',
  fontFamily: 'Open Sans',
  padding: '2rem',
  transition: 'all 0.2s ease-in-out',
  marginBottom: '1rem',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.3)',
  },
});

type FolderCardProps = {
  folder: string;
  setSettings: (folder: string) => void;
};

type BotInfo = {
  name?: string;
  url?: string;
};

export default function FolderCard({
  folder,
  setSettings,
}: FolderCardProps): JSX.Element {
  const [isOpeningFolder] = useState('');
  const [info, setInfo] = useState<BotInfo>({});
  const name = (folder || '').split(path.sep).pop();
  const { removeFolder } = useHomeContext();

  const openFolder = (): void => {
    setSettings(folder);
  };

  const handleRemove = () => {
    removeFolder(folder);
  };

  useEffect(() => {
    ipcRenderer.invoke('getBotInfo', folder).then((botInfo) => {
      console.log({ botInfo });
      if (botInfo) {
        setInfo(botInfo);
        console.log({ botInfo });
      }
    });
  }, []);

  return (
    <Container>
      <div className="d-flex flex-column justify-content-between">
        <BotIcon url={info.url} />
        <h3
          className="mb-4"
          style={{
            fontFamily: 'Open Sans',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {info.name || name}
        </h3>
        <XIcon
          className="x-icon"
          style={{ maxHeight: '2rem' }}
          onClick={handleRemove}
        />
      </div>
      <p className="mb-2 text-muted">{folder}</p>
      <Button onClick={openFolder} variant="secondary">
        Open{' '}
        {isOpeningFolder === folder ? (
          <Spinner animation="border" size="sm" />
        ) : null}
      </Button>
    </Container>
  );
}
