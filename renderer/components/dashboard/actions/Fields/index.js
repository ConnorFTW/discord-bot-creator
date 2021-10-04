import Editor from "./Code";

export const SUPPORTED_FIELDS = ["code"];
export const fieldsSupported = (fields = []) => {
  return fields.every((field) => SUPPORTED_FIELDS.includes(field));
};

export default function FieldManager({ fields, fieldValues }) {
  return (
    <>
      {fields.map((field) => {
        if (field === "code") {
          return <Editor key={field} value={fieldValues[field]} />;
        }
      })}
    </>
  );
}
