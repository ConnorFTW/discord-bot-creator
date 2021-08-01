import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import RemoveCommandButton from "./remove-command-button";

export default function CommandView({
  command,
  botId,
  prefix,
  autoRestart,
  toggleHints,
}) {
  const [state, setState] = useState(command);
  const { name, description, enabled, config } = state || {};
  const [process, setProcess] = useState({});

  const enable = () => {
    setState({ ...state, enabled: true });
  };

  const disable = () => {
    setState({ ...state, enabled: false });
  };

  const updateConfig = (key) => (e) => {
    if (config[key]) {
      config[key].value = e.target.value;
    } else {
      console.error(`No config found for key ${key}`);
    }
    setState({ config, ...state });
  };

  const save = (e) => {
    e.preventDefault();
    setProcess({ ...process, isSaving: true });
    fetch(`/api/bot/${botId}/config`, {
      body: JSON.stringify(state),
      method: "PUT",
    })
      .then(() => autoRestart && startBot(botId))
      .then(() => {
        setProcess({ ...process, isSaving: false });
        mutate(`/api/bot/${botId}/config`);
      })
      .catch(console.error);
  };

  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Col>
            <h1>
              <span style={{ color: "grey" }}>{prefix || "!"}</span>
              {name || "Untitled"}
            </h1>
            <p>{description}</p>
          </Col>
          <Col md="auto"></Col>
        </Row>
        <Form>
          {Object.keys(config || {}).map((key) => (
            <Form.Group key={key} className="mb-3">
              <Form.Label>{config[key].name || key}</Form.Label>
              <Form.Control
                type="text"
                value={config[key].value}
                onInput={updateConfig(key)}
                onChange={updateConfig(key)}
                as={config[key].type === "text" ? "textarea" : "input"}
              />
              {toggleHints !== false && (
                <Form.Text>{config[key].description || ""}</Form.Text>
              )}
            </Form.Group>
          ))}
        </Form>
      </Col>
      <Col className="command-actions">
        {process.isSaving ? (
          <Button disabled className="w-100 mb-2">
            <Spinner animation="border" size="sm" /> Saving...
          </Button>
        ) : (
          <Button className="w-100 mb-2" onClick={save}>
            Save
          </Button>
        )}
        {enabled ? (
          <Button onClick={disable} variant="secondary" className="w-100 mb-2">
            Disable
          </Button>
        ) : (
          <>
            <Button onClick={enable} className="mt-1 w-100 mb-2">
              Enable
            </Button>
            <RemoveCommandButton
              name={name}
              endpoint={`/api/bot/${botId}/config`}
            />
          </>
        )}
      </Col>
      <pre>{JSON.stringify(command, null, 2)}</pre>
    </Row>
  );
}
