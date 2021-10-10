import { PlayIcon } from "@heroicons/react/solid";
import { ipcRenderer } from "electron";
import { log } from "electron-log";
import { Spinner } from "react-bootstrap";
import { useControls } from "./Context";

export default function ControlsStart() {
  const [controls, setControls] = useControls();
  const { isStopping, isStarting, isSaving } = controls;

  const run = () => {
    if (isStopping || isStarting || isSaving) return;
    setControls({ ...controls, isStarting: true });

    ipcRenderer.on("onBotRun", (_event, res = {}) => {
      log({ res });
      if (res.success) {
        setControls({ ...controls, isStarting: false, isRunning: true });
      } else {
        setControls({ ...controls, isStarting: false, isRunning: false });
      }
    });
    ipcRenderer.send("onBotRun");
  };

  return isStarting ? (
    <Spinner
      style={{ height: "1.5rem", width: "1.5rem", margin: "0.25rem" }}
      animation="grow"
      variant="primary"
    />
  ) : (
    <div onClick={run} style={{ cursor: "pointer" }}>
      <PlayIcon />
    </div>
  );
}
