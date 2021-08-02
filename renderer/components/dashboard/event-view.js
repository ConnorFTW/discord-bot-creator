import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import useActions from "../../lib/hooks/useActions";
import ActionForm from "./custom-config-view/action-form";

export default function EventView({ event: _event }) {
  const [event, setEvent] = useState(event || {});
  const [actionSchemas] = useActions();
  const actions = event.actions || [];

  useEffect(() => setEvent(_event), [!!_event]);

  if (event && !event.trigger) {
    setEvent({ ...event, trigger: "message" });
  }

  const updateAction = (i, action) => {
    const actions = event.actions;
    actions[i] = { ...actions[i], ...action };

    setEvent({ ...event, actions });
  };

  const removeAction = (i) => () => {
    const actions = event.actions;
    actions.splice(i, 1);
    setEvent({ ...event, actions });
  };

  const addAction = () => {
    setEvent({
      ...event,
      actions: [...(event.actions || []), { type: "Send Message" }],
    });
  };

  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Col>
            <h1>{event.name}</h1>
          </Col>
          <Col md="auto"></Col>
        </Row>
        <Form>
          <Form.Group>
            <Form.Label>Trigger</Form.Label>
            <Form.Select
              value={event.trigger}
              onChange={(e) => setEvent({ ...event, trigger: e.target.value })}
            >
              <option value="message">Message</option>
              <option value="guildMemberAdd">New Member</option>
              <option value="guildMemberRemove">Member Left</option>
              <option value="clickButton">Button Click</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Actions</Form.Label>
            <br />
            <Button onClick={addAction}>Add Action</Button>
          </Form.Group>
          {event.actions?.map((action, i) => (
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
              command={event}
            />
          ))}
        </Form>
      </Col>
      <pre className="d-none">{JSON.stringify(event, null, 2)}</pre>
      <pre className="d-none">{JSON.stringify(actions, null, 2)}</pre>
      <pre className="d-none">{JSON.stringify(actionSchemas, null, 2)}</pre>
    </Row>
  );
}
