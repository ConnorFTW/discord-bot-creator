import { Button, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";

const renderTooltip = (error) => (props) =>
  (
    <Tooltip id="button-tooltip" {...props}>
      {error}
    </Tooltip>
  );

export default function ActionItem({ action, index, onSelect }) {
  const {
    removeAction,
    updateActionIndex,
    showActionModal,
    handlerIndex,
    errors,
  } = useDashboardContext();

  const remove = (e) => {
    e.stopPropagation();
    removeAction(index);
  };

  const select = () => {
    updateActionIndex(index);
    showActionModal();
  };

  const error = errors.find((e) => {
    return e.handlerIndex === handlerIndex && e.actionIndex === index;
  });

  return (
    <Col>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip(error?.message)}
        show={!!error}
      >
        <Form.Group
          className={
            "border p-2 my-2 mx-0 row align-items-center " +
            (error ? "border-danger" : "")
          }
          onSelect={onSelect(index)}
          style={{ cursor: "pointer", backgroundColor: "#35393f" }}
          onClick={select}
        >
          <p className="col my-0">{action?.name}</p>
          <Button className="btn-sm btn-danger btn-close" onClick={remove} />
        </Form.Group>
      </OverlayTrigger>
    </Col>
  );
}
