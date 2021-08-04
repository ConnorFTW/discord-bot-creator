import { Col, Row, Tab } from "react-bootstrap";
import useCommands from "../../lib/useCommands";
import Sidebar from "./sidebar/index";
import useEvents from "../../lib/useEvents";
import EventView from "./event/EventView";
import CommandView from "./command/CommandView";
import { useDashboardContext } from "./DashboardContext";
import { useEffect } from "react";

export default function DashboardWindow() {
  // Component Controls
  const { mode, updateHandlers, handler } = useDashboardContext();

  // Data
  const [events = []] = useEvents();
  const [commands = []] = useCommands();

  let isEvent = mode === "event";

  useEffect(() => {
    if (mode === "event") {
      isEvent = true;
      updateHandlers(events);
    } else {
      isEvent = false;
      updateHandlers(commands);
    }
  }, [mode]);

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
