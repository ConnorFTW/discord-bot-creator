import PropTypes from "prop-types";
import React from "react";
import { Form, FormControl, FormGroup } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function ReasonField({ value }) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField("reason", e.target.value);
  };

  return (
    <FormGroup className="mb-3">
      <Form.Label>Reason</Form.Label>
      <br />
      <FormControl type="text" value={value} onChange={onChange} />
    </FormGroup>
  );
}

ReasonField.propTypes = {
  value: PropTypes.string,
};
