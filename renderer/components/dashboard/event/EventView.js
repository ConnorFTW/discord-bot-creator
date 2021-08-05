import { Container } from "react-bootstrap";
import ActionForm from "../actions/ActionForm";
import ActionList from "../actions/ActionList";
import EventHeader from "./EventHeader";

export default function EventView() {
  return (
    <Container>
      <EventHeader />
      <ActionList Form={ActionForm} />
    </Container>
  );
}
