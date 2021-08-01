import { Col, Row, Tab } from "react-bootstrap";
import CommandView from "../../components/dashboard/command-view";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import CustomCommandView from "../../components/dashboard/custom-command-view";
import Sidebar from "../../components/sidebar";
import SettingsModal from "../../components/dashboard/modals/settings";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer || false;

export default function Dashboard() {
  const { query } = useRouter();
  const [commands, setCommands] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [selected, setSelected] = useState("");

  useEffect(() => {
    ipcRenderer.on("getCommands", (_event, commands) => {
      setCommands(commands);
      setIsLoading(commands && events);
    });
    ipcRenderer.send("getCommands");
  }, []);

  useEffect(() => {
    ipcRenderer.on("getEvents", (_event, events) => {
      setEvents(events);
      setIsLoading(commands && events);
    });
    ipcRenderer.send("getEvents");
  }, []);

  useEffect(() => {
    ipcRenderer.on("getSettings", (event, settings) => {
      setSettings(settings);
    });
  }, []);
  const [modalShow, setModalShow] = useState(false);
  const [settingsShow, setSettingsShow] = useState(false);

  function onChange(command) {
    const commands = command || [];
    const index = commands.findIndex((elem) => elem.name === command.name);
    commands[index] = command;
  }

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
          />
          <Col
            md={9}
            className="p-4 command-view"
            style={{ overflowY: "auto", maxHeight: "100vh" }}
          >
            <Tab.Content>
              {(commands || [])
                .concat(events?.map((c) => ({ c: true, ...c })) || [])
                ?.map((command, i) => (
                  <Tab.Pane
                    eventKey={command.name}
                    key={command.name}
                    active={(!selected && i === 0) || selected === command.name}
                  >
                    {command.c ? (
                      <CustomCommandView
                        command={command}
                        onChange={onChange}
                        botId={query.id}
                        prefix={settings?.prefix}
                        autoRestart={settings?.autoRestart}
                        toggleHints={settings?.toggleHints}
                      />
                    ) : (
                      <CommandView
                        command={command}
                        onChange={onChange}
                        botId={query.id}
                        prefix={settings?.prefix}
                        autoRestart={settings?.autoRestart}
                        toggleHints={settings?.toggleHints}
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
