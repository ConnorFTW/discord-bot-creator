import { Spinner } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { useControls } from "./Context";

export default function ControlsStart() {
  const [controls, setControls] = useControls();
  const { isStopping, isStarting, isSaving } = controls;

  const run = () => {
    if (isStopping || isStarting || isSaving) return;
    setControls({ ...controls, isStarting: true });

    ipcRenderer.on("onBotRun", (_event, res = {}) => {
      console.log({ res });
      if (res.success) {
        setControls({ ...controls, isStarting: false, isRunning: true });
      } else {
        setControls({ ...controls, isStarting: false, isRunning: false });
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
