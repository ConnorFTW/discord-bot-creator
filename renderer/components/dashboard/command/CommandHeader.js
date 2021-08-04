import { Col, Form, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";

export default function DashboardWindowHeader() {
  const { handler: command } = useDashboardContext();

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
          <Form.Group>
            <Form.Label>Command Type</Form.Label>
            <Form.Select
              value={command.comType}
              onChange={() => update(index, "comType", e.target.value)}
            >
              <option value="0">Normal Command</option>
              <option value="1">Includes Word</option>
              <option value="2">Matches Regular Expression</option>
              <option value="3">Any Message</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Permissions</Form.Label>
            <Form.Select
              value={command.permissions}
              onChange={() => update(index, "permissions", e.target.value)}
            >
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="CREATE_INSTANT_INVITE">
                Create Instant Invite
              </option>
              <option value="KICK_MEMBERS">Kick Members</option>
              <option value="BAN_MEMBERS">Ban Members</option>
              <option value="MANAGE_CHANNELS">Manage Channels</option>
              <option value="MANAGE_GUILD">Manage Guild</option>
              <option value="ADD_REACTIONS">Add Reactions</option>
              <option value="VIEW_AUDIT_LOG">View Audit Log</option>
              <option value="PRIORITY_SPEAKER">Priority Speaker</option>
              <option value="STREAM">Stream</option>
              <option value="VIEW_CHANNEL">View Channel</option>
              <option value="SEND_MESSAGES">Send Messages</option>
              <option value="SEND_TTS_MESSAGES">Send TTS Messages</option>
              <option value="MANAGE_MESSAGES">Manage Messages</option>
              <option value="EMBED_LINKS">Embed Links</option>
              <option value="ATTACH_FILES">Attach Files</option>
              <option value="READ_MESSAGE_HISTORY">Read Message History</option>
              <option value="MENTION_EVERYONE">Mention Everyone</option>
              <option value="USE_EXTERNAL_EMOJIS">Use External Emojis</option>
              <option value="VIEW_GUILD_INSIGHTS">View Guild Insights</option>
              <option value="CONNECT">Connect</option>
              <option value="SPEAK">Speak</option>
              <option value="MUTE_MEMBERS">Mute Members</option>
              <option value="DEAFEN_MEMBERS">Deafen Members</option>
              <option value="MOVE_MEMBERS">Move Members</option>
              <option value="USE_VAD">Use VAD</option>
              <option value="CHANGE_NICKNAME">Change Nickname</option>
              <option value="MANAGE_NICKNAMES">Manage Nicknames</option>
              <option value="MANAGE_ROLES">Manage Roles</option>
              <option value="MANAGE_WEBHOOKS">Manage Webhooks</option>
              <option value="MANAGE_EMOJIS">Manage Emojis</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
