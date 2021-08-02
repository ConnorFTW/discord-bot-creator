import { Col, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import CustomCommandView from "../../components/dashboard/custom-command-view";
import Sidebar from "../../components/sidebar";
import SettingsModal from "../../components/dashboard/modals/settings";
import electron from "electron";
import _eval from "eval";

const ipcRenderer = electron.ipcRenderer || false;

export default function Dashboard({}) {
  const { query } = useRouter();
  const [commands, setCommands] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("command");
  const [actionSchemas, setActionsSchemas] = useState([]);
  const [settingsShow, setSettingsShow] = useState(false);

  useEffect(async () => {
    ipcRenderer.on("getCommands", (_event, commands) => {
      setCommands(JSON.parse(commands || {}).filter((c) => c));
      setIsLoading(!commands || !events);
    });
    ipcRenderer.on("getActions", (_event, actionSchemas) => {
      console.log(actionSchemas);
      setActionsSchemas(actionSchemas);
    });
    ipcRenderer.on("getSettings", (event, settings) => {
      console.log(settings);
      setSettings(settings);
    });
    ipcRenderer.on("getEvents", (_event, events) => {
      setEvents(JSON.parse(events).filter((e) => e));
      setIsLoading(!commands || !events);
    });

    ipcRenderer.send("getCommands");
    ipcRenderer.send("getActions");
    ipcRenderer.send("getSettings");
    ipcRenderer.send("getEvents");
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
            isValidating={isLoading}
            customCommand={events}
            selected={selected}
            setSelected={setSelected}
            botData={settings}
            data={commands}
            setModalShow={setModalShow}
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
              {optionList?.map((command, i) => (
                <Tab.Pane
                  eventKey={command?.name}
                  key={command?.name}
                  active={(!selected && i === 0) || selected === command?.name}
                >
                  <CustomCommandView
                    command={command}
                    onChange={onChange}
                    botId={query.id}
                    prefix={settings?.prefix}
                    autoRestart={settings?.autoRestart}
                    toggleHints={settings?.toggleHints}
                    actions={command?.actions}
                    actionSchemas={actionSchemas}
                  />
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
