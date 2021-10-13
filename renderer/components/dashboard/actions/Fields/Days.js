import PropTypes from "prop-types";
import React from "react";
import { Form, FormControl, FormGroup } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function DaysField({ value }) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField("days", e.target.value);
  };

  return (
    <FormGroup className="mb-3">
      <Form.Label>Days of messages to delete</Form.Label>
      <br />
      <FormControl type="number" value={value} onChange={onChange} />
    </FormGroup>
  );
}

DaysField.propTypes = {
  value: PropTypes.string,
};
