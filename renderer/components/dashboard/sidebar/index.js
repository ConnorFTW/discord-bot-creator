import PropTypes from 'prop-types';
import { Badge, Button, Card, Col, Form, Nav, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import SidebarBotControls from "./Controls";
import ControlsContextProvider from "./Controls/Context";
import SidebarItems from "./Items";

export default function Sidebar({ selected }) {
  const {
    errors,
    handlers,
    commands,
    events,
    updateHandlerIndex,
    handlerIndex,
    addHandler,
  } = useDashboardContext();

  return (
    <>
      <Col md={4}>
        <Row className="sidebar px-0">
          <Col className="navbar align-items-start nowrap">
            <SidebarItems />
          </Col>
          <Card className="px-0">
            <Card.Body className="px-2 overflow-auto">
              <Nav variant="pills" className="flex-column d-md-block d-none">
                {handlers.map((d, i) => (
                  <Nav.Item key={d?.name + "-" + i}>
                    <Nav.Link
                      eventKey={"nav-link-" + d?.name + "-" + i}
                      active={handlerIndex === i}
                      onClick={() => updateHandlerIndex(i)}
                      className="d-flex flex-row justify-content-between align-items-center mb-2 cursor-pointer"
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: d?.name }}
                        className="w-100"
                      />
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
              <ControlsContextProvider>
                <SidebarBotControls />
              </ControlsContextProvider>
            </Card.Footer>
            <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
              <Button onClick={() => addHandler()} variant="secondary">
                Add Command
              </Button>
            </Card.Footer>
          </Card>
        </Row>
      </Col>
    </>
  );
}

Sidebar.propTypes = {
  selected: PropTypes.any
};
