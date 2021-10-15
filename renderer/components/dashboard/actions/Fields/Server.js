import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { useDashboardContext } from "../../DashboardContext";

export default function GuildField({ fields, guildField }) {
  const { updateField, action } = useDashboardContext();
  // Find "varName" field after "guild" field
  // To know which "varName" field we should store the value in
  const varNameField =
    fields.find((field) => field.startsWith("varName")) || "varName";
  const varName = action[varNameField];
  const guild = action[guildField];

  const onChangeGuild = (e) => {
    updateField("server", e.target.value);
  };
  const onChangeVarName = (e) => {
    updateField(varNameField, e.target.value);
  };
  const startsWithNumber = !isNaN(parseInt(varName[0]));
  const varNameVisible = guild && parseInt(guild) > 0;

  return (
    <FormGroup className="mb-3 d-flex gap-3">
      <div className={varNameVisible && "w-auto"}>
        <FormLabel>Server</FormLabel>
        <FormSelect value={guild} onChange={onChangeGuild}>
          <option value={0}>None</option>
          <option value={1}>Temp Variable</option>
          <option value={2}>Server Variable</option>
          <option value={3}>Global Variable</option>
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
