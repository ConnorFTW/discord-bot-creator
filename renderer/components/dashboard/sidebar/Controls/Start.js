import { Spinner } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { PlayIcon } from "@heroicons/react/solid";
import { useControls } from "./Context";

export default function ControlsStart() {
  const [controls, setControls] = useControls();
  const { isStopping, isStarting, isSaving } = controls;

  const run = () => {
    if (isStopping || isStarting || isSaving) return;
    setControls({ ...state, isStarting: true });

    ipcRenderer.on("onBotRun", (_event, res = {}) => {
      if (res.success) {
        setControls({ ...state, isStarting: false, isRunning: true });
      } else {
        setControls({ ...state, isStarting: false, isRunning: false });
      }
    });
    ipcRenderer.send("onBotRun");
  };

  if (isStarting) {
    return (
      <Spinner
        style={{ height: "1.5rem", width: "1.5rem", margin: "0.25rem" }}
        animation="grow"
        variant="primary"
      />
    );
  } else {
    return (
      <div onClick={run}>
        <PlayIcon />
      </div>
    );
  }
}
