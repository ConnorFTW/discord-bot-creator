import PropTypes from 'prop-types';
import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import React from "react";
import { useDashboardContext } from "../../DashboardContext";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

function Editor({ value }) {
  const { updateField } = useDashboardContext();

  return (
    <div style={{ width: "100%" }}>
      <CodeEditor
        value={value}
        language="js"
        placeholder="Please enter JS code."
        onChange={(e) => updateField("code", e.target.value)}
        padding={15}
        style={{
          fontSize: 16,
          fontWeight: "bold",
          backgroundColor: "#000000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          width: "100%",
        }}
      />
    </div>
  );
}

export default Editor;

Editor.propTypes = {
  value: PropTypes.string
};
