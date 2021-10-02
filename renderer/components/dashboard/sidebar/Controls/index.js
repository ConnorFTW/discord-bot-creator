import { Button } from "react-bootstrap";
import useSettings from "../../../../lib/useSettings";
import { useControls } from "./Context";
import ControlsSave from "./Save";
import ControlsStart from "./Start";
import ControlsStop from "./Stop";

export default function SidebarBotControls() {
  const [controls] = useControls();
  const [settings] = useSettings();

  if (!settings?.token) {
    return <Button onClick={() => setSettingsShow(true)}>Add token</Button>;
  }

  return (
    <div className="bot-controls d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
      {controls.isRunning ? (
        <>
          <ControlsSave />
          <ControlsStop />
        </>
      ) : (
        <ControlsStart />
      )}
    </div>
  );
}
