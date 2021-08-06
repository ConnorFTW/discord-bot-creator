import { Button, Form } from "react-bootstrap";
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
    <Form.Group
      className="border p-2 my-3"
      onSelect={() => onSelect(index)}
      style={{ cursor: "pointer" }}
      onClick={select}
    >
      <p>{action?.name}</p>
      <Button className="btn-sm btn-danger btn-close" onClick={remove} />
    </Form.Group>
  );
}
