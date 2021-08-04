import { useState } from "react";
import { Button, ButtonGroup, Card, Form, Nav, Spinner } from "react-bootstrap";
import SidebarBotControls from "./SidebarBotControls";
import SettingsIcon from "../../icons/SettingsIcon";
import SettingsModal from "../settings/SettingsModal";
import { useDashboardContext } from "../DashboardContext";

export default function Sidebar({ selected, setSelected, commands, events }) {
  const [settingsShow, setSettingsShow] = useState(false);
  const { mode, updateMode } = useDashboardContext();

  return (
    <>
      <Card md={3} className="col px-0 sidebar">
        <Card.Header className="d-none d-md-block">
          <ButtonGroup className="d-flex">
            <Button variant="secondary" onClick={() => updateMode("command")}>
              Commands
            </Button>
            <Button variant="secondary" onClick={() => updateMode("event")}>
              Events
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="px-2">
          <Nav variant="pills" className="flex-column d-md-block d-none ">
            {(mode === "event" ? events : commands)?.map((d, i) => (
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
          <Form.Group className="d-md-none">
            <Form.Select
              id="command"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {(commands || [])?.concat(events || [])?.map((c, i) => (
                <option key={c?.name} onClick={() => setSelected(c?.name)}>
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
          <Button onClick={() => {}} variant="secondary">
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
      <SettingsModal
        show={settingsShow}
        onHide={() => setSettingsShow(false)}
      />
    </>
  );
}
