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
  const [settings, setSettings] = useState("{}");
  const [actions, setActions] = useState("{}");
  const isValidating = false;
  const bots = [];
  const router = useRouter();

  async function createNewBot(e) {
    e.preventDefault();
    const slug = generateAlphaNumericString();
    ipcRenderer.send("createBot", { folder, slug });
    router.push(`/dashboard/${slug}`);
  }

  function onBotChange(changes) {
    setBot(changes);
  }

  function pickFolder() {
    ipcRenderer.send("directoryDialog");
  }

  function generateAlphaNumericString() {
    return Math.random().toString(36).substr(2, 10);
  }

  function getSettings(e) {
    e.preventDefault();
    ipcRenderer.send("getSettings");
  }

  function getActions() {
    ipcRenderer.send("getActions");
  }

  useEffect(() => {
    ipcRenderer.on("directoryDialog", (event, data) => {
      console.log(data);
      setFolder(data);
    });

    ipcRenderer.on("getSettings", (event, data) => {
      setSettings(data);
    });

    ipcRenderer.on("getActions", (event, data) => {
      setActions(data);
    });

    ipcRenderer.on("getLastDirectory", (event, data) => {
      if (data) {
        setFolder(data);
      }
    });

    ipcRenderer.send("getLastDirectory");
    return () => {
      ipcRenderer.removeAllListeners("directoryDialog");
      ipcRenderer.removeAllListeners("getSettings");
      ipcRenderer.removeAllListeners("getActions");
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
                <Form.Group>
                  <Form.Label>Token</Form.Label>
                  <Form.Control type="text" className="mb-2" />
                  <Form.Text>
                    You don't have to put it in just yet, you can add or change
                    it later.
                  </Form.Text>
                </Form.Group>
                {folder || (
                  <Button onClick={pickFolder} className="mt-3">
                    Pick a folder
                  </Button>
                )}
                {folder && (
                  <>
                    <Button
                      type="submit"
                      onClick={createNewBot}
                      className="mt-3 mx-3"
                    >
                      Create new bot
                    </Button>
                    <Button onClick={getActions} className="mt-3 mx-3">
                      Get Actions
                    </Button>
                  </>
                )}
              </Form>
            )}
          </Row>
        </Container>
      )}
    </>
  );
}
