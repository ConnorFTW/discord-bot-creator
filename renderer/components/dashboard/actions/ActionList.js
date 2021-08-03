import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ActionItem from "./ActionListItem";

export default function ActionList({ mode, onSelect, items, remove, add }) {
  return (
    <Row>
      <Col sm="8" className="mx-2 command-form">
        {mode === "event" ? <EventForm /> : <CommandForm />}
        <Form>
          <Row>
            <Form.Label>Actions</Form.Label>
            <Button onClick={add}>Add Action</Button>
          </Row>
          {items?.map((action, i) => (
            <ActionItem
              action={action}
              key={i}
              index={i}
              remove={remove}
              onClick={onSelect}
            />
          ))}
        </Form>
      </Col>
    </Row>
  );
}
