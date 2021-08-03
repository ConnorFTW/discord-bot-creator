import { Button, Form } from "react-bootstrap";
import { useState } from "react";
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
    <Form.Group className="border p-2 my-3" onClick={openAction}>
      {/* <Form.Select
          value={action.name}
          onChange={(e) => updateName(e.target.value)}
        >
          {actionNames?.map((name, i) => (
            <option value={name} key={name + "" + i}>
              {name}
            </option>
          ))}
        </Form.Select> */}
      <p>{action.name}</p>
      <Button className="btn-sm btn-danger btn-close" onClick={remove} />
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
