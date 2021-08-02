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
              <option value="0">Bot Initialization</option>
              <option value="1">On Interval</option>
              <option value="2">Bot Join Server</option>
              <option value="3">Member Join Server</option>
              <option value="4">Member Leave Server</option>
              <option value="5">Channel Create</option>
              <option value="6">Channel Delete</option>
              <option value="7">Role Create</option>
              <option value="8">Role Delete</option>
              <option value="9">Member Unbanned</option>
              <option value="10">Voice Channel Create</option>
              <option value="11">Voice Channel Delete</option>
              <option value="12">Emoji Create</option>
              <option value="13">Emoji Delete</option>
              <option value="14">Message Deleted</option>
              <option value="15">Server Update</option>
              <option value="16">Member Update</option>
              <option value="17">Presence Update</option>
              <option value="18">Member Voice Update</option>
              <option value="19">Channel Update</option>
              <option value="20">Channel Pins Update</option>
              <option value="21">Role Update</option>
              <option value="22">Message Update</option>
              <option value="23">Emoji Update</option>
              <option value="24">Message Reaction Added</option>
              <option value="25">Message Reaction Removed</option>
              <option value="26">All Message Reactions Removed</option>
              <option value="27">Member Becomes Available</option>
              <option value="28">Member Chunck Received</option>
              <option value="29">Member Starts/StopsSpeaking</option>
              <option value="30">User Typing Starts</option>
              <option value="31">User Typing Stops</option>
              <option value="32">Server Becomes Unavailable</option>
              <option value="33">On Bot Error</option>
              <option value="34">On Time Restricted Command</option>
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
