import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function MemberField({ fields, index, memberField }) {
  const { updateField, action, mode } = useDashboardContext();
  // Find "varName" field after "member" field
  // To know which "varName" field we should store the value in
  const varNameField =
    fields.find((field) => field.startsWith("varName")) || "varName";
  const varName = action[varNameField];
  const member = action[memberField];

  const onChangeMember = (e) => {
    updateField(memberField, e.target.value);
  };
  const onChangeVarName = (e) => {
    updateField(varNameField, e.target.value);
  };
  const startsWithNumber = !isNaN(parseInt(varName[0]));
  const varNameVisible = member && parseInt(member) > 1;

  return (
    <FormGroup className="mb-3 d-flex gap-3">
      <div className={varNameVisible && "w-auto"}>
        <FormLabel>Member</FormLabel>
        <FormSelect value={member} onChange={onChangeMember}>
          {mode === "command" ? (
            <>
              <option value="0">Mentioned User</option>
              <option value="1">Command Author</option>
            </>
          ) : null}
          <option value="2">Temp Variable</option>
          <option value="3">Server Variable</option>
          <option value="4">Global Variable</option>
          {/* Only available in "Ban Member" action <option value="5">By ID</option> */}
        </FormSelect>
      </div>
      {varNameVisible ? (
        <div className="flex-grow-1">
          <FormLabel>Variable Name</FormLabel>
          <FormControl
            type="text"
            value={varName}
            onChange={onChangeVarName}
            placeholder="Variable name"
            isInvalid={startsWithNumber || !varName}
          />
          {startsWithNumber && (
            <FormControl.Feedback type="invalid">
              Variable name should start with a letter
            </FormControl.Feedback>
          )}
        </div>
      ) : null}
    </FormGroup>
  );
}
