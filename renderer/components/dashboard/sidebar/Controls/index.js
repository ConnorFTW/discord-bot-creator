import { Button, Spinner } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { SaveIcon, StopIcon } from "@heroicons/react/solid";
import { useControls } from "./Context";
import ControlsStart from "./Start";
import useSettings from "../../../../lib/useSettings";

export default function SidebarBotControls() {
  const [controls, setControls] = useControls();
  const [settings] = useSettings();

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
      console.log("Saved");
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

  if (!settings?.token) {
    return <Button onClick={() => setSettingsShow(true)}>Add token</Button>;
  }

  return (
    <div className="bot-controls d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
      {controls.isRunning ? (
        <>
          {controls.isSaving ? (
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
          <ControlsStart />
        </>
      ) : (
        <ControlsStart />
      )}
    </div>
  );
}
