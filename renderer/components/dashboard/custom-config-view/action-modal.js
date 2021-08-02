import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import parseFunction from "parse-function-string";

export default function ActionModal({
  actionSchema,
  action,
  show,
  isEvent,
  onHide,
}) {
  const [state, setState] = useState({ visible: false, html: "" });
  useEffect(() => {
    if (!actionSchema?.name || !action) return;

    const data = action || {};
    const content = "";
    const val1 = "";
    const val2 = "";
    const inputData = "";
    const item = "";
    data.messages = [];
    data.variables = [];
    data.sendTargets = [];
    data.members = [];
    data.conditions = [
      `
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If true:<br>
      <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iftrueContainer" style="display: none; float: right; width: 60%;">
      <span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 18px;">
    <div style="float: left; width: 35%;">
      If false:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0">Continue Actions</option>
        <option value="1" selected>Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
    </div><br><br><br>
  </div>
    `,
    ];

    const init = parseFunction(actionSchema.init).body;
    actionSchema.fields?.forEach((field) => {
      console.log(field);
      let elem = document.getElementById(field);
      console.log({ elem });
      if (!elem) return;
      elem.value = data[field];
      elem?.addEventListener("onchange", (e) => {
        console.log("Changing");
        //update(actionIndex, { ...action, [field]: e.target.value });
      });
    });
    console.log(actionSchema.name);

    let htmlFunction = new Function(
      "isEvent",
      "data",
      parseFunction(actionSchema.html).body
    );
    let initFunction = new Function(
      "data",
      parseFunction(actionSchema.init).body
    );

    let html;
    const context = {
      glob: {
        sendTargetChange() {},
        variableChange() {},
        memberChange() {},
        messageChange() {},
      },
      document,
      getHtml() {
        html = htmlFunction.bind(this)(isEvent, data);
      },
      init() {
        initFunction.bind(this)(data);
      },
    };
    context.getHtml();
    if (state.html) {
      context.init();
    }
    setState({ ...state, html });
  }, [actionSchema?.name, !!action, !!state.html]);

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "60vh", overflowY: "scroll" }}>
        <div dangerouslySetInnerHTML={{ __html: state.html }} />
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={onHide}>Close</Button>
        <Button
          onClick={() => setData(settings)}
          variant="success"
          className="mt-3"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
