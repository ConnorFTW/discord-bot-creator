import { Button, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import parseFunction from "parse-function-string";
import { useDashboardContext } from "../DashboardContext";
import { evalHTML, evalInit, evalListener } from "../../../lib/runInContext";

export default function ActionForm({ show, isEvent, onHide }) {
  const { action, actionSchema, updateAction } = useDashboardContext();

  const [state, setState] = useState({ visible: false, html: null });
  const content = useRef(null);

  useEffect(() => {
    if (
      !actionSchema?.name ||
      !action ||
      !state.html ||
      !content.current?.children
    )
      return;

    // Keep track of all the listeners to remove them later
    const listeners = [];

    evalInit(actionSchema.init, action, isEvent);

    actionSchema.fields?.forEach((field) => {
      let elem = document.getElementById(field);
      if (!elem) return;
      elem.value = action[field];

      const changeFunction = elem.onchange;
      elem.onchange = "";

      const listener = (e) => {
        if (!changeFunction) return;
        evalListener(changeFunction, action, isEvent, elem);
        updateAction({ ...action, [field]: e.target.value });
      };

      elem?.addEventListener("change", listener);
      listeners.push([elem, "change", listener]);
    });

    return () => {
      listeners.forEach(([elem, event, listener]) => {
        elem?.removeEventListener(event, listener);
      });
    };
  }, [state.html, show]);

  useEffect(() => {
    // !show is important because it otherwise would render and set the html when we have the old action selected
    if (!actionSchema.html || !action || state.html || !show) return;

    const html = evalHTML(actionSchema.html, action, isEvent);
    setState({ ...state, html });
  }, [actionSchema.html, show, state.html]);

  const hide = () => {
    setState({ ...state, html: null });
    content.current = null;
    onHide();
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={hide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {action.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "60vh", overflowY: "scroll" }}>
        <div dangerouslySetInnerHTML={{ __html: state.html }} ref={content} />
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={hide}>Close</Button>
        <Button onClick={hide} variant="success">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
