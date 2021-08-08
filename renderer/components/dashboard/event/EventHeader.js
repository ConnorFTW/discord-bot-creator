import { Col, Form, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import HandlerNameInput from "../handlers/HandlerNameInput";

export default function EventHeader() {
  const { handler: event, updateHandler } = useDashboardContext();

  const onSelect = (e) => {
    updateHandler({ ["event-type"]: e.target.value });
  };

  return (
    <Row>
      <Col sm="8" className="mx-2 mb-3 command-form">
        <Row>
          <Col className="mb-4">
            <HandlerNameInput />
          </Col>
          <Col md="auto"></Col>
        </Row>
        <Form>
          <Form.Group>
            <Form.Label>Trigger</Form.Label>
            <Form.Select value={event?.["event-type"]} onChange={onSelect}>
              <option value="0">None</option>
              <option value="1">Bot Initialization</option>
              <option value="2">Message Sent</option>
              <option value="3">On Interval</option>
              <option value="4">Bot Join Server</option>
              <option value="5">Member Join Server</option>
              <option value="6">Member Leave Server</option>
              <option value="7">Channel Create</option>
              <option value="8">Channel Delete</option>
              <option value="9">Role Create</option>
              <option value="10">Role Delete</option>
              <option value="11">Member Unbanned</option>
              <option value="12">Voice Channel Create</option>
              <option value="13">Voice Channel Delete</option>
              <option value="14">Emoji Create</option>
              <option value="15">Emoji Delete</option>
              <option value="16">Message Deleted</option>
              <option value="17">Server Update</option>
              <option value="18">Member Update</option>
              <option value="19">Presence Update</option>
              <option value="20">Member Voice Update</option>
              <option value="21">Channel Update</option>
              <option value="22">Channel Pins Update</option>
              <option value="23">Role Update</option>
              <option value="24">Message Update</option>
              <option value="25">Emoji Update</option>
              <option value="26">Message Reaction Added</option>
              <option value="27">Message Reaction Removed</option>
              <option value="28">All Message Reactions Removed</option>
              <option value="29">Member Becomes Available</option>
              <option value="30">Member Chunck Received</option>
              <option value="31">Member Starts/StopsSpeaking</option>
              <option value="32">User Typing Starts</option>
              <option value="33">User Typing Stops</option>
              <option value="34">Server Becomes Unavailable</option>
              <option value="35">On Bot Error</option>
              <option value="36">On Time Restricted Command</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
