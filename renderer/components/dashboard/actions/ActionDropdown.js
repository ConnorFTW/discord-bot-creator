import { Badge } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDashboardContext } from "../DashboardContext";

export default function ActionDropdown({ name, className, create }) {
  const { actionSchemas, updateAction, addAction } = useDashboardContext();
  const filterByFields = ["name", "section"];

  const select = (items) => {
    const selected = items[0];
    if (!selected) return;
    const newAction = { name: selected.name };

    selected.fields.forEach((field) => {
      newAction[field] = "";
    });

    if (create) {
      addAction(newAction);
    } else {
      updateAction(newAction, false);
    }
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
      className={className}
      inputProps={{
        shouldSelectHint: (shouldSelect, e) => {
          console.log(e.key);
          return e.key === "Enter" || shouldSelect;
        },
      }}
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
