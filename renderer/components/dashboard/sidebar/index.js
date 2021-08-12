import { useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Nav,
  Overlay,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import SidebarBotControls from "./SidebarBotControls";
import SettingsModal from "../settings/SettingsModal";
import { useDashboardContext } from "../DashboardContext";
import {
  ChatAlt2Icon,
  LightningBoltIcon,
  TerminalIcon,
  CogIcon,
} from "@heroicons/react/solid";

const renderTooltip = (text) => (props) =>
  (
    <Tooltip id="tab-tooltip" {...props}>
      {text}
    </Tooltip>
  );

export default function Sidebar({ selected, setSelected }) {
  const [settingsShow, setSettingsShow] = useState(false);
  const {
    errors,
    updateMode,
    mode,
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
      <Col md={4}>
        <Row className="sidebar px-0">
          <Col className="navbar align-items-start nowrap">
            <OverlayTrigger
              placement="auto"
              overlay={renderTooltip("Commands")}
            >
              <div
                className={mode === "command" ? "active" : ""}
                onClick={setMode("command")}
              >
                <ChatAlt2Icon />
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="auto" overlay={renderTooltip("Events")}>
              <div
                className={mode === "event" ? "active" : ""}
                onClick={setMode("event")}
              >
                <LightningBoltIcon />
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="auto" overlay={renderTooltip("Logs")}>
              <div
                className={mode === "logs" ? "active" : ""}
                onClick={setMode("logs")}
              >
                <TerminalIcon />
              </div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="auto"
              overlay={renderTooltip("Settings")}
            >
              <div onClick={() => setSettingsShow(true)} className="mt-auto">
                <CogIcon />
              </div>
            </OverlayTrigger>
          </Col>
          <Card className="px-0">
            <Card.Body className="px-2">
              <Nav variant="pills" className="flex-column d-md-block d-none">
                {handlers.map((d, i) => (
                  <Nav.Item key={d?.name + "-" + i}>
                    <Nav.Link
                      eventKey={"nav-link-" + d?.name + "-" + i}
                      active={handlerIndex === i}
                      onClick={() => updateHandlerIndex(i)}
                      className="d-flex flex-row justify-content-between align-items-center mb-2"
                    >
                      <span>{d?.name}</span>
                      {errors.filter((e) => e.handlerIndex === i).length ? (
                        <Badge bg="danger" text="light">
                          {errors.filter((e) => e.handlerIndex === i).length}
                        </Badge>
                      ) : null}
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
            <Card.Footer>
              <SidebarBotControls />
            </Card.Footer>
            <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
              <Button onClick={() => addHandler()} variant="secondary">
                Add Command
              </Button>
            </Card.Footer>
          </Card>
        </Row>
      </Col>
      <SettingsModal
        show={settingsShow}
        onHide={() => setSettingsShow(false)}
      />
    </>
  );
}
