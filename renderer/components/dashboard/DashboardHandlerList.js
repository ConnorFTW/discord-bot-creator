import { Col, Tab } from "react-bootstrap";
import { useState } from "react";
import useCommands from "../lib/useCommands";
import CommandHeader from "../components/dashboard/CommandHeader";
import EventHeader from "../components/dashboard/EventHeader";
import useEvents from "../lib/useEvents";

export default function DashboardHandlerList({ selected }) {
  // Component Controls
  const [selected] = useState("");

  // Data
  const [events] = useEvents();
  const [commands] = useCommands();

  const optionList = (commands || [])?.concat(events || []);

  return (
    <Col
      md={9}
      className="p-4 command-view"
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <Tab.Content>
        {optionList?.map(({ name, "event-type": eventType } = {}, i) => (
          <Tab.Pane
            eventKey={name + "-" + i}
            key={name}
            active={(!selected && i === 0) || selected === name}
          >
            {typeof eventType !== "undefined" ? (
              <EventHeader event={optionList[i]} eventIndex={i} />
            ) : (
              <CommandHeader command={optionList[i]} commandIndex={i} />
            )}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Col>
  );
}
