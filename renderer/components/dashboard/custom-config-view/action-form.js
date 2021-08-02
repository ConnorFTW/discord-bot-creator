import { Button, Form, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import parseFnString from "parse-function-string";
import useActions from "../../../lib/hooks/useActions";

export default function ActionForm({
  action,
  update,
  remove,
  actionIndex,
  isEvent,
}) {
  const [actionSchemas] = useActions();
  const actionSchema =
    actionSchemas.find(({ name }) => name === action.name) || {};
  const actionNames = actionSchemas?.map(({ name }) => name);
  const [state, setState] = useState({});

  const updateName = (newName) => {
    const schema = actionSchemas.find(({ name }) => name === newName);
    let action = { name: newName };
    schema.fields?.forEach((fields) => {
      action[fields] = "";
    });
    update(actionIndex, action);
  };

  useEffect(() => {
    if (!actionSchema || !action) return;

    const data = action || {};
    data.messages = [];
    data.variables = [];
    data.sendTargets = [];
    data.members = [];
    data.conditions = [];

    let htmlFunction = new Function(
      "isEvent",
      "data",
      parseFnString(actionSchema.html).body
    );

    setState({ ...state, html: htmlFunction(isEvent, data) });
  }, [actionSchema?.name, !!action]);

  return (
    <Form.Group className="border p-2 my-3">
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={action.name}
          onChange={(e) => updateName(e.target.value)}
        >
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
      <pre>{JSON.stringify(action, null, 2)}</pre>
    </Form.Group>
  );
}
