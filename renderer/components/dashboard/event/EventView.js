import { Container } from "react-bootstrap";
import ActionForm from "../actions/ActionForm";
import ActionList from "../actions/ActionList";
import { useDashboardContext } from "../DashboardContext";
import EventHeader from "./EventHeader";

export default function EventView() {
  const { handler } = useDashboardContext();

  return (
    <Container>
      <EventHeader event={handler} />
      <ActionList Form={ActionForm} />
    </Container>
  );
}
