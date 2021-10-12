import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function StorageField() {
  const { updateField, action } = useDashboardContext();
  const varName = action.varName;
  const storage = action.storage;

  const onChangeStorage = (e) => {
    updateField("storage", e.target.value);
  };
  const onChangeVarName = (e) => {
    updateField("varName", e.target.value);
  };
  const startsWithNumber = !isNaN(parseInt(varName[0]));
  const varNameVisible = storage && parseInt(storage) > 0;

  return (
    <FormGroup className="mb-3 d-flex gap-3">
      <div className={varNameVisible && "w-auto"}>
        <FormLabel>Storage</FormLabel>
        <FormSelect value={storage} onChange={onChangeStorage}>
          <option value={0}>None</option>
          <option value={1}>Temp Variable</option>
          <option value={2}>Server Variable</option>
          <option value={3}>Local Variable</option>
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
