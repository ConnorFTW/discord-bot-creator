import PropTypes from "prop-types";
import Editor from "./Code";
import ColorField from "./Color";
import CommentField from "./Comment";
import DaysField from "./Days";
import FindField from "./Find";
import FindServerField from "./FindServer";
import GuildField from "./Guild";
import MemberField from "./Member";
import ReasonField from "./Reason";
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
  "member",
  "member2",
  "varName2",
  "guild",
  "guild2",
  "days",
  "reason",
];
export const fieldsSupported = (fields = []) => {
  fields.forEach((field) => {
    if (!SUPPORTED_FIELDS.includes(field)) {
      console.log(`Field ${field} is not supported`);
    }
  });
  return fields.every((field) => SUPPORTED_FIELDS.includes(field));
};

export default function FieldManager({ fields, fieldValues }) {
  return (
    <>
      {fields.map((field, index) => {
        if (field === "code") {
          return <Editor key={field} value={fieldValues[field]} />;
        }
        if (field === "comment") {
          return <CommentField value={fieldValues[field]} />;
        }
        if (field === "color") {
          return <ColorField value={fieldValues[field]} />;
        }
        if (field === "days") {
          return <DaysField value={fieldValues[field]} />;
        }
        if (field === "reason") {
          return <ReasonField value={fieldValues[field]} />;
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

        // These actions contain two or more fields
        if (field.startsWith("storage")) {
          // varName field is included here
          return (
            <StorageField fields={fields} index={index} storageField={field} />
          );
        }
        if (field.startsWith("member")) {
          // varName field is included here
          return (
            <MemberField fields={fields} index={index} memberField={field} />
          );
        }
        if (field.startsWith("guild")) {
          return (
            <GuildField fields={fields} index={index} guildField={field} />
          );
        }
      })}
    </>
  );
}

FieldManager.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  fieldValues: PropTypes.object,
};
