import { Col, Form, Row } from "react-bootstrap";

export default function EventHeader({ event }) {
  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Col>
            <h1>{event?.name}</h1>
          </Col>
          <Col md="auto"></Col>
        </Row>
        <Form>
          <Form.Group>
            <Form.Label>Trigger</Form.Label>
            <Form.Select value={event?.trigger}>
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
        </Form>
      </Col>
    </Row>
  );
}
