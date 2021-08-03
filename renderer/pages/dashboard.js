import { Button, Col, Row, Tab } from "react-bootstrap";
import { useState } from "react";
import Head from "next/head";
import useCommands from "../lib/useCommands";
import CommandHeader from "../components/dashboard/CommandHeader";
import EventHeader from "../components/dashboard/EventHeader";
import Sidebar from "../components/dashboard/sidebar/index";
import SettingsModal from "../components/dashboard/settings/SettingsModal";
import electron from "electron";
import useSettings from "../lib/useSettings";
import useEvents from "../lib/useEvents";

const ipcRenderer = electron.ipcRenderer || false;

export default function Dashboard({}) {
  // Component Controls
  const [selected, setSelected] = useState("");
  const [settingsShow, setSettingsShow] = useState(false);
  const [mode, setMode] = useState("command");
  const [isSaving, setIsSaving] = useState(false);

  // Data
  const [events] = useEvents();
  const [commands] = useCommands();
  const [settings] = useSettings({});

  const save = () => {
    setIsSaving(true);
    if (window._commands) {
      ipcRenderer.send("saveCommands", window._commands);
      ipcRenderer.on("saveCommands", (_event, _commands) => {
        console.log(_commands);
        setIsSaving(false);
      });
    }
    if (window._events) {
      ipcRenderer.send("saveEvents", window._events);
      ipcRenderer.on("saveEvents", (_event, _events) => {
        console.log(_events);
        setIsSaving(false);
      });
    }
  };

  function onChange({ command, event }) {
    if (command) {
      const commands = command || [];
      const index = commands.findIndex((elem) => elem.name === command.name);
      commands[index] = command;
    } else if (event) {
      const events = event || [];
      const index = events.findIndex((elem) => elem.name === event.name);
      events[index] = event;
    }
  }

  const optionList = (commands || [])?.concat(
    events?.map((c) => ({ c: true, ...c })) || []
  );
  return (
    <>
      <Head>
        <title>DBC | Bot Behavior</title>
      </Head>
      <Tab.Container>
        <Row className="mx-0">
          <Sidebar
            customCommand={events}
            selected={selected}
            setSelected={setSelected}
            data={commands}
            setSettingsShow={setSettingsShow}
            setMode={setMode}
            mode={mode}
            SaveButton={
              <Button onClick={save}>{isSaving ? "Saving..." : "Save"}</Button>
            }
          />
          <Col
            md={9}
            className="p-4 command-view"
            style={{ overflowY: "auto", maxHeight: "100vh" }}
          >
            <Tab.Content>
              <Button onClick={save}>{isSaving ? "Saving..." : "Save"}</Button>
              {optionList?.map(({ name, "event-type": eventType } = {}, i) => (
                <Tab.Pane
                  eventKey={name}
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
        </Row>
      </Tab.Container>
      <SettingsModal
        show={settingsShow}
        onHide={() => setSettingsShow(false)}
        settings={settings}
      />
    </>
  );
}
