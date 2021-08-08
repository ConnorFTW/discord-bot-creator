import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";

export default function LogView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const listener = (event, logs = []) => {
      setLogs(logs);
    };

    ipcRenderer.on("onLogsUpdate", listener);

    return () => {
      ipcRenderer.removeListener("onLogsUpdate", listener);
    };
  }, [JSON.stringify(logs)]);

  useEffect(() => {
    ipcRenderer.send("getLogs");
  }, []);

  const onClear = () => {
    ipcRenderer.send("clearLogs");
    setLogs([]);
  };

  return (
    <Container className="d-flex flex-column mt-auto h-100">
      <div className="mt-auto">
        {logs.map((log, i) => (
          <Card key={i} className="p-3 mb-2 align-self-end">
            {log}
          </Card>
        ))}
      </div>
      <Button
        bsStyle="primary"
        bsSize="large"
        onClick={onClear}
        className="mt-3"
      >
        Clear
      </Button>
    </Container>
  );
}
