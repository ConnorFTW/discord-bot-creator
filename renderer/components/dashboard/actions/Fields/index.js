import PropTypes from "prop-types";
import Editor from "./Code";
import ColorField from "./Color";
import CommentField from "./Comment";
import FindField from "./Find";
import FindServerField from "./FindServer";
import ServerInfoField from "./ServerInfo";
import StorageField from "./Storage";

export const SUPPORTED_FIELDS = [
  "code",
  "comment",
  "color",
  "find",
  "serverInfo",
  "storage",
  "varName",
];
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

        // If serverInfo AND find are present we render the FindServerField
        if (field === "find" && fields.includes("serverInfo")) return null;
        if (field === "serverInfo" && fields.includes("find")) {
          return <FindServerField />;
        }

        if (field === "serverInfo") {
          return <ServerInfoField value={fieldValues[field]} />;
        }
        if (field === "find") {
          return <FindField value={fieldValues[field]} />;
        }
        if (field === "storage") {
          // varName field is included here
          return <StorageField value={fieldValues[field]} />;
        }
      })}
    </>
  );
}

FieldManager.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  fieldValues: PropTypes.object,
};
