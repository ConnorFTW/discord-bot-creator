import { FormControl, FloatingLabel } from "react-bootstrap";
import { useDashboardContext } from "../DashboardContext";

export default function HandlerNameInput(props) {
  const { handler, updateHandler } = useDashboardContext();

  const update = (event) => {
    updateHandler({ name: event.target.value || "NewEvent" });
  };

  return (
    <FloatingLabel controlId="floatingInputGrid" label="Name">
      <FormControl
        type="text"
        defaultValue={handler.name}
        onChange={update}
        onBlur={update}
      />
    </FloatingLabel>
  );
}
