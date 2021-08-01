import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Form, Nav, Spinner } from "react-bootstrap";
import SettingsIcon from "./icons/settings";

export default function Sidebar({
  isValidating,
  customCommand,
  selected,
  botData,
  setSelected,
  data,
  setModalShow,
  setSettingsShow,
  setMode,
  mode,
}) {
  const { query } = useRouter();
  const [state, setState] = useState({});
  useEffect(() => {
    if (botData) {
      setState({
        ...state,
        isRunning: botData.running,
      });
    }
  }, [botData]);

  const save = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isSaving: true });
    fetch(`/api/bot/${query.id}/start`, {
      method: "POST",
    }).then(() => {
      setState({ ...state, isSaving: false });
    });
  };

  const run = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStarting: true });
    fetch(`/api/bot/${query.id}/start`, {
      method: "POST",
    }).then(() => {
      setState({ ...state, isStarting: false, isRunning: true });
    });
  };

  const stop = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStopping: true });
    fetch(`/api/bot/${query.id}/stop`, {
      method: "POST",
    }).then(() => {
      setState({ ...state, isStopping: false, isRunning: false });
    });
  };

  return (
    <>
      <Card md={3} className="col px-0 sidebar">
        <Card.Header className="d-none d-md-block">
          <ButtonGroup className="d-flex">
            <Button variant="secondary" onClick={() => setMode("command")}>
              Commands
            </Button>
            <Button variant="secondary" onClick={() => setMode("event")}>
              Events
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="px-2">
          {isValidating ? (
            <Spinner animation="border" />
          ) : (
            <Nav variant="pills" className="flex-column d-md-block d-none ">
              {(mode === "command" ? data : customCommand)?.map((d, i) => (
                <Nav.Item key={d?.name}>
                  <Nav.Link
                    eventKey={d?.name}
                    active={(!selected && i === 0) || selected === d?.name}
                    onClick={() => setSelected(d?.name)}
                  >
                    {d?.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          )}
          <Form.Group className="d-md-none">
            <Form.Select
              id="command"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {(data || [])?.concat(customCommand || [])?.map((c, i) => (
                <option key={c?.name} onClick={() => setSelected(c?.name)}>
                  {c?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          {query?.id && botData?.token ? (
            <>
              {state.isRunning ? (
                <>
                  <Button
                    onClick={save}
                    variant="success"
                    className="mx-1"
                    disabled={state.isSaving}
                  >
                    {state.isSaving ? "Restarting..." : "Restart"}
                  </Button>
                  <Button
                    onClick={stop}
                    variant="danger"
                    className="mx-1"
                    disabled={state.isStopping}
                  >
                    {state.isStopping ? "Stopping..." : "Stop"}
                  </Button>
                </>
              ) : (
                <Button onClick={run} disabled={state.isStarting}>
                  {state.isStarting ? "Starting..." : "Run"}
                </Button>
              )}
            </>
          ) : null}
          {!query?.id || botData?.token ? null : (
            <Button onClick={() => setSettingsShow(true)}>Add token</Button>
          )}
        </Card.Footer>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          <Button onClick={() => setModalShow(true)} variant="secondary">
            Add Command
          </Button>
          <SettingsIcon
            onClick={() => setSettingsShow(true)}
            className="settings-button"
            style={{
              height: "1.5rem",
              color: "grey",
            }}
          />
        </Card.Footer>
      </Card>
    </>
  );
}
