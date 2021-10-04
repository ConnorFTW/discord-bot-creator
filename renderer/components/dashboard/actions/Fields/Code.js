import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";

export default function CodeField({ show }) {
  const container = useRef(null);
  if (!show) return null;
  useEffect(() => {
    if (!window?.MonacoEnvironment) return;
    if (!container.current) return;
    console.log("Hey");
    window.MonacoEnvironment.getWorkerUrl = () => {
      return "_next/static/editor.worker.js";
    };

    monaco.editor.create(container.current, {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
        "\n"
      ),
      language: "javascript",
      theme: "vs-dark",
      minimap: {
        enabled: false,
      },
    });
    monaco.editor.remeasureFonts();
  }, [!!container?.current]);

  return (
    <div style={{ height: "25vh", width: "100%" }}>
      <div id="container" ref={container} style={{ height: "100%" }}></div>{" "}
    </div>
  );
}
