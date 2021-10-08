import PropTypes from 'prop-types';
import Editor from "./Code";
import ColorField from "./Color";
import CommentField from "./Comment";

export const SUPPORTED_FIELDS = ["code", "comment", "color"];
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
        if (field === "comment") {
          return <CommentField value={fieldValues[field]} />;
        }
        if (field === "color") {
          return <ColorField value={fieldValues[field]} />;
        }
      })}
    </>
  );
}

FieldManager.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  fieldValues: PropTypes.object
};
