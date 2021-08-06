import { Button, Col, Form, Row } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";
import ActionItem from "./ActionListItem";

export default function ActionList({ Form: ActionForm }) {
  const { actions, addAction } = useDashboardContext();

  return (
    <Row>
      <Col sm="8" className="mx-2 mb-3 command-form">
        <Form.Label>Actions</Form.Label>
        <br />
        <Button onClick={() => addAction({})}>Add Action</Button>
        {actions?.map((action, i) => (
          <>
            {action && <ActionForm action={action} />}
            <ActionItem action={action} key={i} index={i} />
          </>
        ))}
      </Col>
    </Row>
  );
}
