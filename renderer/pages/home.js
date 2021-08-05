import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import electron from "electron";
import { useRouter } from "next/router";

const ipcRenderer = electron.ipcRenderer || false;

export default function Dashboard() {
  const [folder, setFolder] = useState("");
  const isValidating = false;
  const bots = [];
  const router = useRouter();

  // Can be used to create a bot
  async function setSettings(e) {
    e.preventDefault();
    window._folder = folder;
    router.push(`/dashboard`);
  }

  function pickFolder() {
    ipcRenderer.send("directoryDialog");
  }

  useEffect(() => {
    ipcRenderer.on("directoryDialog", (event, data) => {
      console.log(data);
      setFolder(data);
    });

    ipcRenderer.on("getSettings", (event, data) => {
      if (data?.folder) {
        window._folder = data.folder;
        router.push(`dashboard/`);
      }
    });

    ipcRenderer.on("getLastDirectory", (event, data) => {
      if (data) {
        setFolder(data);
      }
    });

    ipcRenderer.send("getLastDirectory");
    ipcRenderer.send("getSettings");
    return () => {
      ipcRenderer.removeAllListeners("directoryDialog");
      ipcRenderer.removeAllListeners("getSettings");
      ipcRenderer.removeAllListeners("getLastDirectory");
    };
  }, []);

  return (
    <>
      <Head>
        <title>DBC | Dashboard</title>
      </Head>
      {isValidating ? (
        <Container className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" />
        </Container>
      ) : (
        <Container className="mt-4">
          <Row>
            {bots?.[0] ? (
              bots.map((bot) => (
                <Col key={bot._id}>
                  <Card className="m-3 p-3">
                    <h3>{bot.name}</h3>
                    <p>Prefix: {bot.prefix}</p>
                    <Link href={`/dashboard/${bot._id}`}>
                      <Button>Continue</Button>
                    </Link>
                  </Card>
                </Col>
              ))
            ) : (
              <Form>
                {folder ? (
                  <Button
                    type="submit"
                    onClick={setSettings}
                    className="mt-3 mx-3"
                  >
                    Create new bot
                  </Button>
                ) : (
                  <Button onClick={pickFolder} className="mt-3">
                    Pick a folder
                  </Button>
                )}
              </Form>
            )}
          </Row>
        </Container>
      )}
    </>
  );
}
