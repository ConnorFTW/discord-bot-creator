import { Col, Row, Tab } from "react-bootstrap";
import Sidebar from "./sidebar/index";
import EventView from "./event/EventView";
import CommandView from "./command/CommandView";
import { useDashboardContext } from "./DashboardContext";

export default function DashboardWindow() {
  // Component Controls
  const { mode, handler } = useDashboardContext();

  let isEvent = mode === "event";

  return (
    <Tab.Container>
      <Row className="mx-0">
        <Sidebar />
        <Col
          md={9}
          className="p-4 command-view"
          style={{ overflowY: "auto", maxHeight: "100vh" }}
        >
          {isEvent && <EventView event={handler} />}
          {!isEvent && <CommandView command={handler} />}
        </Col>
      </Row>
    </Tab.Container>
  );
}
