import PropTypes from "prop-types";
import { FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function ServerInfoField({ value }) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField("serverInfo", e.target.value);
  };

  return (
    <FormGroup className="w-25">
      <FormLabel>Source Field</FormLabel>
      <FormSelect onChange={onChange} value={value}>
        <option value="0" selected>
          Server ID
        </option>
        <option value="1">Server Name</option>
        <option value="2">Server Name Acronym</option>
        <option value="3">Server Member Count</option>
        <option value="4">Server Region</option>
        <option value="5">Server Owner ID</option>
        <option value="6">Server Verification Level</option>
        <option value="7">Server Is Available</option>
      </FormSelect>
    </FormGroup>
  );
}

ServerInfoField.propTypes = {
  value: PropTypes.any,
};
