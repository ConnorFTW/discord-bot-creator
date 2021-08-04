import { Button, Col, Form, Row } from "react-bootstrap";
import CommandForm from "../command/CommandForm";
import ActionItem from "./ActionListItem";

export default function ActionList({ mode, onSelect, actions, remove, add }) {
  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        <Row>
          <Form.Label>Actions</Form.Label>
          <Button onClick={add}>Add Action</Button>
        </Row>
        {actions?.map((action, i) => (
          <>
            {action && <CommandForm action={action} />}
            <ActionItem
              action={action}
              key={i}
              index={i}
              remove={remove}
              onClick={onSelect}
            />
          </>
        ))}
      </Col>
    </Row>
  );
}
