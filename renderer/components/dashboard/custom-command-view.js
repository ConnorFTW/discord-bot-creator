import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import ActionForm from "./custom-config-view/action-form";
import RemoveCommandButton from "./remove-command-button";

export default function CustomCommandView({
  command: commandSchema,
  botId,
  actions,
  actionSchemas,
}) {
  const [command, setCommand] = useState(commandSchema);
  const [status, setStatus] = useState({});

  const enable = () => {
    setCommand({ ...command, enabled: true });
    save();
  };

  const disable = () => {
    setCommand({ ...command, enabled: false });
    save();
  };

  if (commandSchema && !command.trigger) {
    setCommand({ ...command, trigger: "message" });
  }

  const updateAction = (i, customAction) => {
    const actions = command.actions;
    actions[i] = customAction;

    setCommand({ ...command, actions });
  };

  const removeAction = (i) => () => {
    const actions = command.actions;
    actions.splice(i, 1);
    setCommand({ ...command, actions });
  };

  const addAction = () => {
    setCommand({
      ...command,
      actions: [...(command.actions || []), { type: "Send Message" }],
    });
  };

  const save = (e) => {
    if (e) e.preventDefault();
    setStatus({ ...status, isSaving: true });
    setTimeout(() => {
      setStatus({ ...status, isSaving: false });
    }, 1000);
  };

  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Col>
            <h1>{command.name}</h1>
          </Col>
          <Col md="auto"></Col>
        </Row>
        <Form>
          {command.c && (
            <Form.Group>
              <Form.Label>Trigger</Form.Label>
              <Form.Select
                value={command.trigger}
                onChange={(e) =>
                  setCommand({ ...command, trigger: e.target.value })
                }
              >
                <option value="message">Message</option>
                <option value="guildMemberAdd">New Member</option>
                <option value="guildMemberRemove">Member Left</option>
                <option value="clickButton">Button Click</option>
              </Form.Select>
            </Form.Group>
          )}
          {!command.c && (
            <Form.Group>
              <Form.Label>Permissions</Form.Label>
              <Form.Select value={command.permissions} />
            </Form.Group>
          )}
          <Form.Group className="mt-3">
            <Form.Label>Actions</Form.Label>
            <br />
            <Button onClick={addAction}>Add Action</Button>
          </Form.Group>
          {command.actions?.map((action, i) => (
            <ActionForm
              action={action}
              actions={actions}
              actionSchema={actionSchemas.find(
                (schema) => schema.name === action.name
              )}
              key={i}
              update={updateAction}
              actionIndex={i}
              remove={removeAction(i)}
              command={command}
            />
          ))}
        </Form>
      </Col>
      <Col className="command-actions">
        {status.isSaving ? (
          <Button disabled className="w-100 mb-2">
            <Spinner animation="border" size="sm" /> Saving...
          </Button>
        ) : (
          <Button className="w-100 mb-2" onClick={save}>
            Save
          </Button>
        )}
        {command.enabled ? (
          <Button onClick={disable} variant="secondary" className="w-100 mb-2">
            Disable
          </Button>
        ) : (
          <>
            <Button onClick={enable} className="mb-2 w-100">
              Enable
            </Button>
            <RemoveCommandButton
              name={commandSchema.name}
              endpoint={`/api/bot/${botId}/custom-config`}
            />
          </>
        )}
      </Col>
      <pre>{JSON.stringify(command, null, 2)}</pre>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
      <pre>{JSON.stringify(actionSchemas, null, 2)}</pre>
    </Row>
  );
}
