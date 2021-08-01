import { ipcRenderer } from "electron";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";

export default function SettingsModal(props) {
  const { query } = useRouter();

  const [settings, setSettings] = useState(props.settings);

  function setData(data) {
    fetch(`/api/bot/${query.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then(() => {
      if (data.running && data.autoRestart) {
        startBot(query.id);
      }
    });
  }

  const changePrefix = (e) => {
    setSettings({ ...settings, prefix: e.target.value });
  };

  const changeEmbedColor = (e) => {
    setSettings({ ...settings, embedColor: e.target.value });
  };

  const changeToken = (e) => {
    setSettings({ ...settings, token: e.target.value });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "80vh", overflowY: "scroll" }}>
        <Form>
          <Form.Group>
            <Form.Label>Prefix</Form.Label>
            <FormControl
              type="text"
              onChange={changePrefix}
              value={settings?.prefix ?? "!"}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Embed Color</Form.Label>
            <Form.Select
              value={settings?.embedColor || "RED"}
              onChange={changeEmbedColor}
            >
              <option value="RANDOM">Random</option>
              <option value="RED">Red</option>
              <option value="ORANGE">Orange</option>
              <option value="YELLOW">Yellow</option>
              <option value="GREEN">Green</option>
              <option value="BLUE">Blue</option>
              <option value="PURPLE">Purple</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Token</Form.Label>
            <FormControl
              type="text"
              value={settings?.token || ""}
              onChange={changeToken}
              placeholder="e.g.: NzI3ODcyOTg0NTc1OTAxNzg2.XvyKig.4eiNtg8CGOkT1Www5sRngSLSJ30"
            />
            <Form.Text>
              Get your token from the{" "}
              <a
                target="_blank"
                href="https://discord.com/developers/applications/"
              >
                bot dashboard
              </a>
            </Form.Text>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Auto Restart"
            checked={!!settings?.autoRestart}
            onChange={(e) =>
              setSettings({ ...settings, autoRestart: e.target.checked })
            }
          />
          <Form.Check
            type="switch"
            label="Toggle Hints"
            checked={settings?.toggleHints !== false}
            onChange={(e) =>
              setSettings({ ...settings, toggleHints: e.target.checked })
            }
          />
          <Form.Group>
            <Button
              className="mt-3"
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="secondary"
            >
              Sign Out
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={props.onHide}>Close</Button>
        <Button
          onClick={() => setData(settings)}
          variant="success"
          className="mt-3"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
