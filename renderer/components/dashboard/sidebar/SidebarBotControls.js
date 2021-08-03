import { Button } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { useState } from "react";

export default function BotControls({ settings = {} }) {
  const [state, setState] = useState({});
  const save = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isSaving: true });
    ipcRenderer.send("saveBot", settings);
  };

  const run = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStarting: true });
    setState({ ...state, isStarting: false, isRunning: true });
  };

  const stop = () => {
    if (state.isStopping || state.isStarting || state.isSaving) return;
    setState({ ...state, isStopping: true });
    setState({ ...state, isStopping: false, isRunning: false });
  };

  if (!settings.token) {
    return <Button onClick={() => setSettingsShow(true)}>Add token</Button>;
  }

  return (
    <>
      {state.isRunning ? (
        <>
          <Button
            onClick={save}
            variant="success"
            className="mx-1"
            disabled={state.isSaving}
          >
            {state.isSaving ? "Restarting..." : "Restart"}
          </Button>
          <Button
            onClick={stop}
            variant="danger"
            className="mx-1"
            disabled={state.isStopping}
          >
            {state.isStopping ? "Stopping..." : "Stop"}
          </Button>
        </>
      ) : (
        <Button onClick={run} disabled={state.isStarting}>
          {state.isStarting ? "Starting..." : "Run"}
        </Button>
      )}
    </>
  );
}
