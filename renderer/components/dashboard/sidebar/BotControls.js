import { Button, Spinner } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import useSettings from "../../../lib/useSettings";
import {
  PauseIcon,
  PlayIcon,
  SaveIcon,
  StopIcon,
} from "@heroicons/react/solid";

export default function SidebarBotControls() {
  const [state, setState] = useState({});
  const [settings] = useSettings();

  useEffect(() => {
    let hasSaved = false;
    const saveListener = (event, data) => {
      console.log("Hey");
      if (hasSaved) return;
      setState({
        ...state,
        isSaving: true,
      });
    };
    ipcRenderer.on("save", saveListener);

    const savedListener = (event, data) => {
      hasSaved = true;
      console.log("Saved");
      setState({
        ...state,
        isSaving: false,
      });
    };
    ipcRenderer.on("saved", savedListener);

    return () => {
      ipcRenderer.removeListener("save", saveListener);
      ipcRenderer.removeListener("saved", savedListener);
    };
  }, [JSON.stringify(state)]);

  const save = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    ipcRenderer.emit("save");
  };

  const run = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStarting: true });

    ipcRenderer.on("onBotRun", (_event, res = {}) => {
      if (res.success) {
        setState({ ...state, isStarting: false, isRunning: true });
      } else {
        setState({ ...state, isStarting: false, isRunning: false });
      }
    });
    ipcRenderer.send("onBotRun");
  };

  const stop = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStopping: true });
    setState({ ...state, isStopping: false, isRunning: false });
    ipcRenderer.on("onBotStop", (_event, res = {}) => {
      if (res.success) {
        setState({ ...state, isStopping: false, isRunning: false });
      } else {
        setState({ ...state, isStopping: false, isRunning: true });
      }
    });
    ipcRenderer.send("onBotStop");
  };

  if (!settings?.token) {
    return <Button onClick={() => setSettingsShow(true)}>Add token</Button>;
  }

  return (
    <div className="bot-controls d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
      {state.isRunning ? (
        <>
          {state.isSaving ? (
            <Spinner
              className="mx-1"
              style={{ height: "1.5rem", width: "1.5rem", margin: "0.25rem" }}
              animation="grow"
              variant="success"
            />
          ) : (
            <div onClick={save}>
              <SaveIcon className="success" />
            </div>
          )}
          {state.isStopping ? (
            <Spinner className="mx-1" />
          ) : (
            <div onClick={stop}>
              <StopIcon className="danger" />
            </div>
          )}
        </>
      ) : state.isStarting ? (
        <Spinner
          style={{ height: "1.5rem", width: "1.5rem", margin: "0.25rem" }}
          animation="grow"
          variant="primary"
        />
      ) : (
        <div onClick={run}>
          <PlayIcon />
        </div>
      )}
    </div>
  );
}
