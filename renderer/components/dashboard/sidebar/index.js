import { useState } from "react";
import { Button, ButtonGroup, Card, Form, Nav } from "react-bootstrap";
import SidebarBotControls from "./SidebarBotControls";
import SettingsIcon from "../../icons/SettingsIcon";
import SettingsModal from "../settings/SettingsModal";
import { useDashboardContext } from "../DashboardContext";

export default function Sidebar({ selected, setSelected }) {
  const [settingsShow, setSettingsShow] = useState(false);
  const {
    updateMode,
    handlers,
    commands,
    events,
    updateHandlerIndex,
    handlerIndex,
    addHandler,
  } = useDashboardContext();

  const setMode = (mode) => () => updateMode(mode);

  return (
    <>
      <Card md={3} className="col px-0 sidebar">
        <Card.Header className="d-none d-md-block">
          <ButtonGroup className="d-flex">
            <Button variant="secondary" onClick={setMode("command")}>
              Commands
            </Button>
            <Button variant="secondary" onClick={setMode("event")}>
              Events
            </Button>
            <Button variant="secondary" onClick={setMode("logs")}>
              Logs
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="px-2">
          <Nav variant="pills" className="flex-column d-md-block d-none ">
            {handlers.map((d, i) => (
              <Nav.Item key={d?.name + "-" + i}>
                <Nav.Link
                  eventKey={"nav-link-" + d?.name + "-" + i}
                  active={handlerIndex === i}
                  onClick={() => updateHandlerIndex(i)}
                >
                  {d?.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Form.Group className="d-md-none">
            <Form.Select
              id="command"
              value={selected}
              onChange={(e) => updateHandlerIndex(e.target.value)}
            >
              {commands?.concat(events || []).map((c, i) => (
                <option
                  key={"select-" + c?.name + "-" + i}
                  onClick={() => updateHandlerIndex(i)}
                  value={i}
                >
                  {c?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          <SidebarBotControls />
        </Card.Footer>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          <Button onClick={() => addHandler()} variant="secondary">
            Add Command
          </Button>
          <Button
            onClick={() => setSettingsShow(true)}
            className="btn-sm btn-secondary"
          >
            <SettingsIcon
              onClick={() => setSettingsShow(true)}
              className="settings-button"
            />
          </Button>
        </Card.Footer>
      </Card>
      <SettingsModal
        show={settingsShow}
        onHide={() => setSettingsShow(false)}
      />
    </>
  );
}
