import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import React from "react";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

function Editor() {
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  return (
    <div style={{ width: "100%" }}>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
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
