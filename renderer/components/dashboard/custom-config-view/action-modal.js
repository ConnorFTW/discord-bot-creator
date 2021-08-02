import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import parseFunction from "parse-function-string";

export default function ActionModal({
  actionSchema,
  action,
  show,
  isEvent,
  onHide,
  update = () => {},
  actionIndex,
}) {
  const [state, setState] = useState({ visible: false, html: "" });

  const glob = {
    variableChange(_this, varName) {
      console.log(_this.value, varName);
      document.getElementById(varName).style.display = +_this.value
        ? "block"
        : "none";
    },
    sendTargetChange(_this, varName) {
      if (isNaN(+_this.value)) return;
      if (+_this.value < 5) {
        document.getElementById(varName).style.display = "none";
      } else {
        document.getElementById(varName).style.display = "block";
      }
    },
    memberChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? "block"
        : "none";
      if (isNaN(+_this.value)) return;
      if (+_this.value < 2) {
        document.getElementById(varName).style.display = "none";
      } else {
        document.getElementById(varName).style.display = "block";
      }
    },
    messageChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? "block"
        : "none";
      if (isNaN(+_this.value)) return;
      if (+_this.value < 1) {
        document.getElementById(varName).style.display = "none";
      } else {
        document.getElementById(varName).style.display = "block";
      }
    },
    refreshVariableList() {},
  };
  useEffect(() => {
    if (!actionSchema?.name || !action) return;

    const data = action || {};
    const content = "";
    const val1 = "";
    const val2 = "";
    const inputData = "";
    const item = "";
    data.messages = [
      `
    <option value="0">Command Message</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
    `,
    ];
    data.variables = [
      `
    <option value="0">Nothing</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
      `,
      `
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
      `,
    ];
    data.sendTargets = [
      `
    <option value="0">Same Channel</option>
    <option value="1">Command Author</option>
    <option value="2">Mentioned User</option>
    <option value="3">Mentioned Channel</option>
    <option value="4">Default Channel</option>
    <option value="5">Temp Variable</option>
    <option value="6">Server Variable</option>
    <option value="7">Global Variable</option>
    `,
    ];
    data.members = [
      `
    <option value="0">Mentioned User</option>
    <option value="1">Command Author</option>
    <option value="2">Temp Variable</option>
    <option value="3">Server Variable</option>
    <option value="4">Global Variable</option>
      `,
    ];
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
      glob,
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

      actionSchema.fields?.forEach((field) => {
        let elem = document.getElementById(field);
        if (!elem) return;
        elem.value = data[field];
        let onChange = elem.onchange;
        if (onChange) {
          onChange = new Function(
            "glob",
            parseFunction(elem.onchange || "").body
          );
        }
        elem.onchange = "";
        elem?.addEventListener("change", (e) => {
          if (onChange) onChange.bind(elem)(glob);
          update(actionIndex, { ...action, [field]: e.target.value });
        });
      });
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
        <Modal.Title id="contained-modal-title-vcenter">
          {action.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "60vh", overflowY: "scroll" }}>
        <div dangerouslySetInnerHTML={{ __html: state.html }} />
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={onHide}>Close</Button>
        <Button onClick={onHide} variant="success" className="mt-3">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
