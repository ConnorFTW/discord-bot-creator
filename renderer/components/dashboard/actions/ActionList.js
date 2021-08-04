import { Button, Col, Form, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import ActionItem from "./ActionListItem";

export default function ActionList({ Form: ActionForm }) {
  const { actions, updateActions } = useDashboardContext();

  function onAdd() {
    actions.push({ name: "Send Message" });
    updateActions(actions);
  }

  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Form.Label>Actions</Form.Label>
          <Button onClick={onAdd}>Add Action</Button>
        </Row>
        {actions?.map((action, i) => (
          <>
            {action && <ActionForm action={action} />}
            <ActionItem action={action} key={i} />
          </>
        ))}
      </Col>
    </Row>
  );
}
