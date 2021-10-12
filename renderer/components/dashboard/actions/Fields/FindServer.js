import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function FindServerField() {
  const { updateField, action } = useDashboardContext();
  const { serverInfo, find } = action;

  const onChangeServerInfo = (e) => {
    updateField("serverInfo", e.target.value);
  };

  const onChangeFind = (e) => {
    updateField("find", e.target.value);
  };

  const source = [
    "Server ID",
    "Server Name",
    "Server Name Acronym",
    "Server Member Count",
    "Server Region",
    "Server Owner ID",
    "Server Verification Level",
    "Server Is Available",
  ][serverInfo || 0];

  return (
    <FormGroup className="d-flex mb-3 gap-3">
      <div>
        <FormLabel>Source Field</FormLabel>
        <FormSelect onChange={onChangeServerInfo} value={serverInfo}>
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
      </div>
      <div>
        <FormLabel>{source}</FormLabel>
        <FormControl
          type="text"
          value={find}
          onChange={onChangeFind}
          placeholder={source}
        ></FormControl>
      </div>
    </FormGroup>
  );
}
