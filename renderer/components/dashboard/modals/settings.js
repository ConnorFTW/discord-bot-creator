import { ipcRenderer } from "electron";
import { useRouter } from "next/dist/client/router";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import useSettings from "../../../lib/hooks/useSettings";

export default function SettingsModal(props) {
  const { query } = useRouter();

  const [settings, setSettings] = useSettings();

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

  let checked = false;

  if (settings?.checked) {
    if (settings.checked === "false") {
      checked = false;
    } else {
      checked = true;
    }
  }

  const changePrefix = (e) => {
    setSettings({ ...settings, prefix: e.target.value });
  };

  const changeToken = (e) => {
    setSettings({ ...settings, token: e.target.value });
  };

  const saveSettings = () => {
    ipcRenderer.send("saveSettings", settings);
    ipcRenderer.on("saveSettings", (event, data) => {
      props.onHide();
    });
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
          <Form.Group className="mb-3">
            <Form.Label>Prefix</Form.Label>
            <FormControl
              type="text"
              onChange={changePrefix}
              value={settings?.tag}
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
            <Form.Label>Separator</Form.Label>
            <FormControl
              type="text"
              value={settings?.separator || ""}
              onChange={changeToken}
              placeholder="\\s+"
            />
            <Form.Text>
              <a
                target="_blank"
                href="https://discord.com/developers/applications/"
              ></a>
            </Form.Text>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Auto Restart"
            checked={!!settings?.autoRestart}
            onChange={(e) =>
              setSettings({ ...settings, autoRestart: e.target.checked })
            }
            className="mb-3"
          />
          <Form.Check
            type="switch"
            label="Case Sensitive"
            checked={settings?.checked === "true" || false}
            onChange={(e) =>
              setSettings({
                ...settings,
                settings: e.target.checked ? "true" : "false",
              })
            }
            className="mb-3"
          />
          <Form.Check
            type="switch"
            label="Toggle Hints"
            checked={settings?.toggleHints !== false}
            onChange={(e) =>
              setSettings({ ...settings, toggleHints: e.target.checked })
            }
            className="mb-3"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={saveSettings} variant="success" className="mt-3">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
