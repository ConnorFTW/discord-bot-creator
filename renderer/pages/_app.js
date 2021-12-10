import PropTypes from 'prop-types';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { HomeProvider } from '../components/home/HomeContext';
import '../styles/style.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HomeProvider>
        <Component {...pageProps} />
      </HomeProvider>
    </>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.any,
};
