import { Button, Form, Col } from "react-bootstrap";
import { useState } from "react";
import parseFnString from "parse-function-string";
import useActions from "../../../lib/hooks/useActions";
import ActionModal from "./action-modal";

export default function ActionForm({
  action,
  update,
  remove,
  actionIndex,
  isEvent,
}) {
  const [open, setOpen] = useState(false);
  const [actionSchemas] = useActions();
  const actionSchema =
    actionSchemas.find(({ name }) => name === action.name) || {};
  const actionNames = actionSchemas?.map(({ name }) => name);

  const updateName = (newName) => {
    const schema = actionSchemas.find(({ name }) => name === newName);
    let action = { name: newName };
    schema.fields?.forEach((fields) => {
      action[fields] = "";
    });
    update(actionIndex, action);
  };

  const openAction = () => {
    setOpen(true);
  };

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
      <Col className="mt-2">
        <Button className="btn-danger btn-sm" onClick={remove}>
          Remove
        </Button>
        <Button className="btn-sm" onClick={openAction}>
          Open
        </Button>
      </Col>
      {open && (
        <ActionModal
          show={true}
          actionSchema={actionSchema}
          action={action}
          isEvent={isEvent}
          onHide={() => setOpen(false)}
          update={update}
          actionIndex={actionIndex}
        />
      )}
    </Form.Group>
  );
}
