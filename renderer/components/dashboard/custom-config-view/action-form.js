import { Button, Form, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import parseFnString from "parse-function-string";

export default function ActionForm({
  action,
  update,
  remove,
  actionIndex,
  actionSchema,
  actionSchemas,
}) {
  const { type } = action;
  const actionNames = actionSchemas?.map(({ name }) => name);
  const [state, setState] = useState({});

  const updateType = (type) => {
    action.type = type;
    update(actionIndex, action);
  };

  useEffect(() => {
    if (!actionSchema) return;

    const data = {};
    data.messages = [];
    data.variables = [];
    data.sendTargets = [];
    data.members = [];
    data.conditions = [];
    const isEvent = 0;

    let htmlFunction = new Function(
      "isEvent",
      "data",
      parseFnString(actionSchema.html).body
    );

    setState({ ...state, html: htmlFunction(false, data) });
  }, [actionSchema?.name]);

  return (
    <Form.Group className="border p-2 my-3">
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select value={type} onChange={(e) => updateType(e.target.value)}>
          {actionNames?.map((name, i) => (
            <option value={name} key={name + "" + i}>
              {name}
            </option>
          ))}
        </Form.Select>
        <Form.Text>{actionSchema?.description}</Form.Text>
      </Form.Group>
      <div
        dangerouslySetInnerHTML={{
          __html: state.html,
        }}
      ></div>
      <Col className="mt-2">
        <Button className="btn-danger btn-sm" onClick={remove}>
          Remove
        </Button>
      </Col>
    </Form.Group>
  );
}
