import PropTypes from "prop-types";
import React from "react";
import { Form, FormControl, FormGroup } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function FindField({ value }) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField("find", e.target.value);
  };

  return (
    <FormGroup className="mb-3">
      <Form.Label>Search Value</Form.Label>
      <br />
      <FormControl type="text" value={value} onChange={onChange} />
    </FormGroup>
  );
}

FindField.propTypes = {
  value: PropTypes.string,
};
