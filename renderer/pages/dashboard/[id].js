import { Col, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import CommandView from "../../components/dashboard/command-view";
import Sidebar from "../../components/sidebar";
import SettingsModal from "../../components/dashboard/modals/settings";
import electron from "electron";
import useSettings from "../../lib/hooks/useSettings";
import EventView from "../../components/dashboard/event-view";
import useEvents from "../../lib/hooks/useEvents";

const ipcRenderer = electron.ipcRenderer || false;

export default function Dashboard({}) {
  const { query } = useRouter();

  // Component Controls
  const [selected, setSelected] = useState("");
  const [settingsShow, setSettingsShow] = useState(false);
  const [mode, setMode] = useState("command");

  // Data
  const [events] = useEvents();
  const [commands, setCommands] = useState([]);
  const [settings] = useSettings({});

  useEffect(async () => {
    ipcRenderer.on("getCommands", (_event, commands) => {
      setCommands(JSON.parse(commands || {}).filter((c) => c));
    });
    ipcRenderer.on("getActions", (_event, actionSchemas) => {
      console.log(actionSchemas);
    });

    ipcRenderer.send("getCommands");
    ipcRenderer.send("getActions");
  }, []);

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
          />
          <Col
            md={9}
            className="p-4 command-view"
            style={{ overflowY: "auto", maxHeight: "100vh" }}
          >
            <Tab.Content>
              {optionList?.map(({ name, "event-type": eventType } = {}, i) => (
                <Tab.Pane
                  eventKey={name}
                  key={name}
                  active={(!selected && i === 0) || selected === name}
                >
                  {typeof eventType !== "undefined" ? (
                    <EventView event={optionList[i]} />
                  ) : (
                    <CommandView
                      command={optionList[i]}
                      onChange={onChange}
                      botId={query.id}
                    />
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
        botId={query.id}
        settings={settings}
      />
    </>
  );
}
