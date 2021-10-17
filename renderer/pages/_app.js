import PropTypes from "prop-types";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "../styles/style.scss";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.any,
};
