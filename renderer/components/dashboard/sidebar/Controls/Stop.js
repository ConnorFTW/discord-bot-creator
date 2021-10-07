import { StopIcon } from "@heroicons/react/solid";
import { ipcRenderer } from "electron";
import { Spinner } from "react-bootstrap";
import { useControls } from "./Context";

export default function ControlsStop() {
  const [controls, setControls] = useControls();

  const stop = () => {
    if (controls.isStopping || controls.isStarting || controls.isSaving) return;
    setControls({ ...controls, isStopping: false, isRunning: false });
    ipcRenderer.on("onBotStop", onBotStop.bind(this));
    ipcRenderer.send("onBotStop");
  };

  const onBotStop = (_event, res = {}) => {
    if (res.success) {
      setControls({ ...controls, isStopping: false, isRunning: false });
    }
    setControls({ ...controls, isStopping: false, isRunning: true });
  };

  return controls.isStopping ? <Spinner className="mx-1" /> : (<div onClick={stop} style={{ cursor: "pointer" }}>
        <StopIcon className="danger" />
      </div>);
}
