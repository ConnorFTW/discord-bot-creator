import { Button, Form, Col } from "react-bootstrap";
import FieldForm from "./field-form";

export default function ActionForm({
  action,
  actions: actionsSchema,
  update,
  remove,
  actionIndex,
  command,
}) {
  const { type } = action;
  const actionNames = actionsSchema?.map(({ name }) => name);
  const actionSchema = actionsSchema?.find(({ name }) => name === type);

  const updateOption = (fieldName, value) => {
    if (!action.config) action.config = {};

    action.config[fieldName] = value;
    update(actionIndex, action);
  };

  const updateType = (type) => {
    action.type = type;
    update(actionIndex, action);
  };

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
      {actionSchema?.config &&
        Object.keys(actionSchema.config).map((fieldName, i) => (
          <FieldForm
            key={`${command?.trigger}_${action.type
              ?.split(" ")
              ?.join("_")
              ?.toLowerCase()}_${fieldName}`}
            field={action?.config?.[fieldName]}
            fieldName={fieldName}
            fieldSchema={actionSchema.config[fieldName]}
            update={updateOption}
            actionIndex={actionIndex}
            actionsSchema={actionsSchema}
            isLoading={!action}
            command={command}
          />
        ))}
      <Col className="mt-2">
        <Button className="btn-danger btn-sm" onClick={remove}>
          Remove
        </Button>
      </Col>
    </Form.Group>
  );
}
