import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

export default function RemoveCommandButton({ name, endpoint }) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    fetch(endpoint, {
      method: "DELETE",
      body: JSON.stringify({ name }),
    })
      .then(() => mutate(endpoint))
      .catch(console.error);
  };

  return (
    <Button
      variant="danger"
      onClick={onClick}
      disabled={isLoading}
      className="mb-2 w-100"
    >
      {isLoading && <Spinner animation="border" size="sm" />} Remove Command
    </Button>
  );
}
