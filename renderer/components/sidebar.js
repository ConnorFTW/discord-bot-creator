import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Form, Nav, Spinner } from "react-bootstrap";
import useSettings from "../lib/hooks/useSettings";
import BotControls from "./dashboard/sidebar/bot-controls";
import SettingsIcon from "./icons/settings";

export default function Sidebar({
  isValidating,
  customCommand,
  selected,
  botData,
  setSelected,
  data,
  setSettingsShow,
  setMode,
  mode,
  SaveButton,
}) {
  const [settings] = useSettings();
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
          <BotControls />
        </Card.Footer>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          <Button onClick={() => {}} variant="secondary">
            Add Command
          </Button>
          {SaveButton}
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
