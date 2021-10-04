import fs from "fs";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "../styles/style.scss";

// list all files in the renderer folder
const files = fs.readdirSync("./renderer");
console.log({ files });

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
