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
    const slug = generateAlphaNumericString();
    ipcRenderer.send("setSettings", { folder, slug });
    router.push(`/dashboard/${slug}`);
  }

  function pickFolder() {
    ipcRenderer.send("directoryDialog");
  }

  function generateAlphaNumericString() {
    return Math.random().toString(36).substr(2, 10);
  }

  useEffect(() => {
    ipcRenderer.on("directoryDialog", (event, data) => {
      console.log(data);
      setFolder(data);
    });

    ipcRenderer.on("getSettings", (event, data) => {
      if (data?.slug) {
        router.push(`/dashboard/${data.slug}`);
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
                <Button onClick={pickFolder} className="mt-3">
                  Pick a folder
                </Button>
                {folder && (
                  <>
                    <Button
                      type="submit"
                      onClick={setSettings}
                      className="mt-3 mx-3"
                    >
                      Create new bot
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
