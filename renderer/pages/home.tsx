import { ipcRenderer } from 'electron';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Form, Row, Spinner } from 'react-bootstrap';
import Button from '../components/core/Button';
import FolderList from '../components/home/folder/List';

export default function Dashboard() {
  const [openingFolder, setOpeningFolder] = useState('');
  const isValidating = false;
  const router = useRouter();

  // Can be used to create a bot
  const setSettings = (folder) => {
    ///@ts-ignore
    window._folder = folder;
    setOpeningFolder(folder);
    if (!ipcRenderer) {
      throw new Error('ipcRenderer is not defined');
    }
    ipcRenderer.send('chooseDirectory', folder);
    ipcRenderer.once('chooseDirectory', () => {
      router.push(`/dashboard`);
      setOpeningFolder('');
    });
  };

  const pickFolder = (): void => {
    if (!ipcRenderer) {
      throw new Error('ipcRenderer is not defined');
    }
    ipcRenderer.send('directoryDialog');
  };

  return (
    <>
      <Head>
        <title>Bot Selection - DBC</title>
      </Head>
      {isValidating ? (
        <Container className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" />
        </Container>
      ) : (
        <Container className="mt-4">
          <Row className="align-items-stretch">
            <FolderList setSettings={setSettings} />
            <Form>
              <Button onClick={pickFolder} className="mt-3">
                Add Bot
              </Button>
            </Form>
          </Row>
        </Container>
      )}
    </>
  );
}
