import {
  ChatAlt2Icon,
  CogIcon,
  LightningBoltIcon,
  TerminalIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import SettingsModal from "../settings/SettingsModal";

const renderTooltip = (text) => (props) =>
  (
    <Tooltip id="tab-tooltip" {...props}>
      {text}
    </Tooltip>
  );

export default function SidebarItems() {
  const [showSettings, setShowSettings] = useState(false);
  const { updateMode, mode } = useDashboardContext();

  const setMode = (mode) => () => updateMode(mode);

  return (
    <>
      <OverlayTrigger placement="auto" overlay={renderTooltip("Commands")}>
        <div
          className={mode === "command" ? "active" : ""}
          onClick={setMode("command")}
          style={{ cursor: "pointer" }}
        >
          <ChatAlt2Icon />
        </div>
      </OverlayTrigger>
      <OverlayTrigger placement="auto" overlay={renderTooltip("Events")}>
        <div
          className={mode === "event" ? "active" : ""}
          onClick={setMode("event")}
          style={{ cursor: "pointer" }}
        >
          <LightningBoltIcon />
        </div>
      </OverlayTrigger>
      <OverlayTrigger placement="auto" overlay={renderTooltip("Logs")}>
        <div
          className={mode === "logs" ? "active" : ""}
          onClick={setMode("logs")}
          style={{ cursor: "pointer" }}
        >
          <TerminalIcon />
        </div>
      </OverlayTrigger>
      <OverlayTrigger placement="auto" overlay={renderTooltip("Settings")}>
        <div
          onClick={()=>setShowSettings(true)}
          className="mt-auto"
          style={{ cursor: "pointer" }}
        >
          <CogIcon />
        </div>
      </OverlayTrigger>
      <SettingsModal
        show={showSettings}
        onHide={()=>setShowSettings(false)}
      />
    </>
  );
}
