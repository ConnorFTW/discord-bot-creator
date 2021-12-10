import { XIcon } from '@heroicons/react/solid';
import path from 'path';
import { useState } from 'react';
import { Button, Card, Col, Spinner } from 'react-bootstrap';
import { useHomeContext } from '../HomeContext';

type FolderCardProps = {
  folder: string;
  setSettings: (folder: string) => void;
};

export default function FolderCard({
  folder,
  setSettings,
}: FolderCardProps): JSX.Element {
  const [isOpeningFolder] = useState('');
  const name = (folder || '').split(path.sep).pop();
  const { removeFolder } = useHomeContext();

  const openFolder = (): void => {
    setSettings(folder);
  };

  const handleRemove = () => {
    removeFolder(folder);
  };

  return (
    <Col md={6}>
      <Card className="p-3 m-3">
        <div className="d-flex flex-row justify-content-between w-100">
          <h3 className="mb-4">{name}</h3>
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
      </Card>
    </Col>
  );
}
