import { Button, Form } from "react-bootstrap";

export default function ActionItem({ action, remove, index, onSelect }) {
  return (
    <Form.Group className="border p-2 my-3" onSelect={() => onSelect(index)}>
      <p>{action?.name}</p>
      <Button className="btn-sm btn-danger btn-close" onClick={remove} />
    </Form.Group>
  );
}
