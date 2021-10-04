import Editor from "react-simple-editor";

export default function CodeField({ show }) {
  if (!show) return null;

  return (
    <div style={{ height: "25vh", width: "100%" }}>
      <Editor />
    </div>
  );
}
