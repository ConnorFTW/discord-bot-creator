import { SaveIcon } from "@heroicons/react/solid";
import { ipcRenderer } from "electron";
import { log } from "electron-log";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useControls } from "./Context";

export default function ControlsSave() {
  const [controls, setControls] = useControls();

  useEffect(() => {
    let hasSaved = false;
    const saveListener = () => {
      if (hasSaved) return;
      setControls({
        ...controls,
        isSaving: true,
      });
    };
    ipcRenderer.on("save", saveListener);

    const savedListener = () => {
      hasSaved = true;
      log("Saved");
      setControls({
        ...controls,
        isSaving: false,
      });
    };
    ipcRenderer.on("saved", savedListener);

    return () => {
      ipcRenderer.removeListener("save", saveListener);
      ipcRenderer.removeListener("saved", savedListener);
    };
  }, [JSON.stringify(controls)]);

  const save = () => {
    if (controls.isStopping || controls.isStarting || controls.isSaving) return;
    ipcRenderer.emit("save");
  };

  return controls.isSaving ? (
    <Spinner
      className="mx-1"
      style={{ height: "1.5rem", width: "1.5rem", margin: "0.25rem" }}
      animation="grow"
      variant="success"
    />
  ) : (
    <div onClick={save} style={{ cursor: "pointer" }}>
      <SaveIcon className="success" />
    </div>
  );
}
