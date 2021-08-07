import { Button, Col, Form } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";

export default function ActionItem({ action, index, onSelect }) {
  const { removeAction, updateActionIndex, showActionModal } =
    useDashboardContext();

  const remove = (e) => {
    e.stopPropagation();
    removeAction(index);
  };

  const select = () => {
    updateActionIndex(index);
    showActionModal();
  };

  return (
    <Col>
      <Form.Group
        className="border p-2 my-2 mx-0 row align-items-center"
        onSelect={() => onSelect(index)}
        style={{ cursor: "pointer" }}
        onClick={select}
      >
        <p className="col my-0">{action?.name}</p>
        <Button className="btn-sm btn-danger btn-close" onClick={remove} />
      </Form.Group>
    </Col>
  );
}
