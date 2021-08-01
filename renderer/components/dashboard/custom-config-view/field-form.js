import { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";

export default function FieldForm({
  fieldSchema,
  update,
  fieldName,
  field,
  actionIndex,
  isLoading,
  command,
  actionsSchema,
}) {
  const options = [...(fieldSchema.options || [])];
  if (fieldSchema.variableOption) {
    options.push(
      ...findVariables(command, actionsSchema, {
        type: fieldSchema.type || "string",
        actionIndex,
      })
    );
  }
  const [isDropdown, setIsDropdown] = useState(!!field?.isDropdown);

  useEffect(() => {
    updateValue();
  }, [isLoading]);

  function updateValue() {
    const fieldTypes = ["string", "number"];
    // Don't update, if still loading, or already has a value
    if (isLoading) return;

    if (isDropdown && field?.value) {
      // Check if the value doesn't match any of the options
      if (!options.some((opt) => opt.key === field.value)) {
        // If not, set the value to the first option
        field.value = options[0]?.key;
        update(field);
      }
    }

    if (field?.value) return;

    if (fieldTypes.includes(fieldSchema.type) && !fieldSchema.options) {
      update(fieldName, {
        value: fieldSchema.default || "",
        isDropdown: field?.isDropdown ?? !!fieldSchema.variableOption,
      });
    } else {
      const value = fieldSchema.default || options[0]?.key || "";
      update(fieldName, {
        value,
        isDropdown: !!options.find((o) => o.key === value),
      });
    }

    setIsDropdown(field?.isDropdown ?? !!fieldSchema.options);
  }

  function OptionsList() {
    return options.map((option, i) => (
      <option value={option.key} key={option.key || i}>
        {option.name}
      </option>
    ));
  }

  function toggleIsDropdown(e) {
    let isDropdown = !e.target.checked;
    if (isDropdown) {
      // Select a valid option upon toggling to dropdown
      update(fieldName, {
        value:
          options.find((o) => o.key === field?.value)?.key ||
          fieldSchema.default ||
          options[0]?.key ||
          "",
        isDropdown,
      });
    } else {
      update(fieldName, {
        value: field?.value,
        isDropdown,
      });
    }
    setIsDropdown(isDropdown);
  }

  return (
    <Form.Group className="mb-3">
      <Row className="d-flex flex-row justify-content-between">
        <Form.Label className="col-6">{fieldSchema.name}</Form.Label>
        {fieldSchema.variableOption &&
          fieldSchema.type === "string" &&
          field && (
            <Form.Check
              type="switch"
              label="Plain Text"
              onChange={toggleIsDropdown}
              value={!isDropdown}
              defaultChecked={!isDropdown}
              className="d-block w-auto"
            />
          )}
      </Row>
      {!fieldSchema.options ||
      (!isDropdown && fieldSchema.type === "string") ? (
        <>
          <Form.Control
            type="text"
            onChange={(e) => update(fieldName, { value: e.target.value })}
            value={field?.value || ""}
          />
          <Form.Text>{fieldSchema.description}</Form.Text>
        </>
      ) : (
        <>
          <Form.Select
            value={field?.value || ""}
            onChange={(e) =>
              update(fieldName, { value: e.target.value, isDropdown: true })
            }
          >
            <OptionsList field={fieldSchema} />
          </Form.Select>
          <Form.Text>{fieldSchema.description}</Form.Text>
        </>
      )}
      <pre className="d-none">{JSON.stringify(field, null, 2)}</pre>
    </Form.Group>
  );
}
