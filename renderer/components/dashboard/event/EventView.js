import { Container } from "react-bootstrap";
import ActionForm from "../actions/ActionForm";
import ActionList from "../actions/ActionList";
import EventHeader from "./EventHeader";
import EventTest from "./EventTest";

export default function EventView() {
  return (
    <Container>
      <EventTest />
      <EventHeader />
      <ActionList Form={ActionForm} />
    </Container>
  );
}
