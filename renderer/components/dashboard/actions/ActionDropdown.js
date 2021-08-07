import { Badge } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDashboardContext } from "../DashboardContext";

export default function ActionDropdown({ name }) {
  const { actionSchemas, updateAction } = useDashboardContext();
  const filterByFields = ["name", "section"];

  const select = (items) => {
    console.log("Selected", items[0]);
    const selected = items[0];
    if (!selected) return;
    const newAction = { name: selected.name };

    selected.fields.forEach((field) => {
      newAction[field] = "";
    });

    updateAction(newAction, false);
  };

  return (
    <Typeahead
      filterBy={filterByFields}
      id="custom-filtering-example"
      labelKey="name"
      options={actionSchemas}
      placeholder="Type an action name"
      onChange={select}
      size="large"
      defaultSelected={[{ name }]}
      multiple={false}
      renderMenuItemChildren={(option) => (
        <div className="text-white">
          {option.name}
          <div>
            <Badge bg="primary">{option.section}</Badge>
          </div>
        </div>
      )}
    />
  );
}
