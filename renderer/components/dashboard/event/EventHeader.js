import { Col, Form, FormControl, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import HandlerNameInput from "../handlers/HandlerNameInput";

export default function EventHeader() {
  const { handler: event, updateHandler } = useDashboardContext();

  const onSelect = (e) => {
    updateHandler({ ["event-type"]: e.target.value });
  };

  const onChangeTemp = (e) => {
    updateHandler({ temp: e.target.value });
  };

  const onChangeTemp2 = (e) => {
    updateHandler({ temp2: e.target.value });
  };

  const eventTypeOptions = [
    { label: "None", temp: false, tempDescription: "" },
    { label: "Bot Initialization", temp: false, tempDescription: "" },
    {
      label: "Message Sent",
      temp: true,
      tempDescription: "Temp Variable Name (stores message that was sent)",
    },
    {
      label: "On Interval",
      temp: true,
      tempDescription: "Interval of Time (in seconds)",
    },
    { label: "Bot Join Server", temp: false, tempDescription: "" },
    { label: "Bot Leave Server", temp: false, tempDescription: "" },
    {
      label: "Member Join Server",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores member that joined the server)",
    },
    {
      label: "Member Leave Server",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores member that left the server)",
    },
    {
      label: "Channel Create",
      temp: true,
      tempDescription: "Temp Variable Name (stores channel that was created)",
    },
    {
      label: "Channel Delete",
      temp: true,
      tempDescription: "Temp Variable Name (stores channel that was deleted)",
    },
    {
      label: "Role Create",
      temp: true,
      tempDescription: "Temp Variable Name (stores role that was created)",
    },
    {
      label: "Role Delete",
      temp: true,
      tempDescription: "Temp Variable Name (stores role that was deleted)",
    },
    {
      label: "Member Banned",
      temp: true,
      tempDescription: "Temp Variable Name (stores member that was banned)",
    },
    {
      label: "Member Unbanned",
      temp: true,
      tempDescription: "Temp Variable Name (stores member that was unbanned)",
    },
    {
      label: "Voice Channel Create",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores voice channel that was created)",
    },
    {
      label: "Voice Channel Delete",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores voice channel that was deleted)",
    },
    {
      label: "Emoji Create",
      temp: true,
      tempDescription: "Temp Variable Name (stores emoji that was created)",
    },
    {
      label: "Emoji Delete",
      temp: true,
      tempDescription: "Temp Variable Name (stores emoji that was deleted)",
    },
    {
      label: "Message Deleted",
      temp: true,
      tempDescription: "Temp Variable Name (stores message that was deleted)",
    },
    {
      label: "Server Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores server prior to update)",
      temp2Description: "Temp Variable Name (stores server after update)",
    },
    {
      label: "Member Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores member prior to update)",
      temp2Description: "Temp Variable Name (stores member after update)",
    },
    {
      label: "Presence Update",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores member prior to their presence update)",
      temp2Description:
        "Temp Variable Name (stores member after their presence update)",
    },
    {
      label: "Member Voice Update",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores member prior to their voice update)",
      temp2Description:
        "Temp Variable Name (stores member after their voice update)",
    },
    {
      label: "Channel Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores channel prior to update)",
      temp2Description: "Temp Variable Name (stores channel after update)",
    },
    {
      label: "Channel Pins Update",
      temp: true,
      tempDescription: "Temp Variable Name (stores channel prior to update)",
    },
    {
      label: "Role Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores role prior to update)",
      temp2Description: "Temp Variable Name (stores role after update)",
    },
    {
      label: "Message Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores message prior to update)",
      temp2Description: "Temp Variable Name (stores message after update)",
    },
    {
      label: "Emoji Update",
      temp: true,
      temp2: true,
      tempDescription: "Temp Variable Name (stores emoji prior to update)",
      temp2Description: "Temp Variable Name (stores emoji after update)",
    },
    {
      label: "Message Reaction Added",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores message reaction that was added)",
    },
    {
      label: "Message Reaction Removed",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores message reaction that was removed)",
    },
    {
      label: "All Message Reactions Removed",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores message that had all reactions removed)",
    },
    {
      label: "Member Becomes Available",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores member that became available)",
    },
    {
      label: "Member Chunck Received",
      temp: true,
      tempDescription: "Temp Variable Name (stores members from chunck)",
    },
    {
      label: "Member Starts/StopsSpeaking",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores member that started/stopped speaking)",
      temp2Description:
        "Temp Variable Name (stores boolean of whether they started/stopped speaking)",
    },
    {
      label: "Member Typing Starts",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores channel where member started typing)",
      temp2Description:
        "Temp Variable Name (stores member that started typing)",
    },
    {
      label: "Member Typing Stops",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores channel where member stopped typing)",
      temp2Description:
        "Temp Variable Name (stores member that stopped typing)",
    },
    {
      label: "Server Becomes Unavailable",
      temp: true,
      tempDescription:
        "Temp Variable Name (stores server that became unavailable)",
    },
    {
      label: "On Bot Error",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores Discord Bot Creator error text)",
      temp2Description:
        "Temp Variable Name (stores Discord Bot Creator error code)",
    },
    {
      label: "On Time Restricted Command",
      temp: true,
      temp2: true,
      tempDescription:
        "Temp Variable Name (stores member that ran the command)",
      temp2Description: "Temp Variable Name (stores amount of time needed)",
    },
  ];

  const option = eventTypeOptions[event?.["event-type"]];

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
          <Form.Group className="mb-3">
            <Form.Label>Trigger</Form.Label>
            <Form.Select value={event?.["event-type"]} onChange={onSelect}>
              <option value="0">None</option>
              <option value="1">Bot Initialization</option>
              <option value="2">Message Sent</option>
              <option value="3">On Interval</option>
              <option value="4">Bot Join Server</option>
              <option value="5">Bot Leave Server</option>
              <option value="6">Member Join Server</option>
              <option value="7">Member Leave Server</option>
              <option value="8">Channel Create</option>
              <option value="9">Channel Delete</option>
              <option value="10">Role Create</option>
              <option value="11">Role Delete</option>
              <option value="12">Member Banned</option>
              <option value="13">Member Unbanned</option>
              <option value="14">Voice Channel Create</option>
              <option value="15">Voice Channel Delete</option>
              <option value="16">Emoji Create</option>
              <option value="17">Emoji Delete</option>
              <option value="18">Message Deleted</option>
              <option value="19">Server Update</option>
              <option value="20">Member Update</option>
              <option value="21">Presence Update</option>
              <option value="22">Member Voice Update</option>
              <option value="23">Channel Update</option>
              <option value="24">Channel Pins Update</option>
              <option value="25">Role Update</option>
              <option value="26">Message Update</option>
              <option value="27">Emoji Update</option>
              <option value="28">Message Reaction Added</option>
              <option value="29">Message Reaction Removed</option>
              <option value="30">All Message Reactions Removed</option>
              <option value="31">Member Becomes Available</option>
              <option value="32">Member Chunck Received</option>
              <option value="33">Member Starts/Stops Speaking</option>
              <option value="34">Member Typing Starts</option>
              <option value="35">Member Typing Stops</option>
              <option value="36">Server Becomes Unavailable</option>
              <option value="37">On Bot Error</option>
              <option value="38">On Time Restricted Command</option>
            </Form.Select>
          </Form.Group>
          {option?.temp && (
            <Form.Group className="mb-3">
              <Form.Label>{option.tempDescription}</Form.Label>
              <FormControl
                type="text"
                value={event?.temp}
                onChange={onChangeTemp}
              />
            </Form.Group>
          )}
          {option?.temp2 && (
            <Form.Group className="mb-3">
              <Form.Label>{option.temp2Description}</Form.Label>
              <FormControl
                type="text"
                value={event?.temp2}
                onChange={onChangeTemp2}
              />
            </Form.Group>
          )}
        </Form>
      </Col>
    </Row>
  );
}
