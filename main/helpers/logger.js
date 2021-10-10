import electronLog from "electron-log";
import timber from "electron-timber";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const log = (message) => {
  timber.log(message);
  if (IS_PRODUCTION) {
    electronLog.info(message);
  }
};

export const warn = (message) => {
  timber.warn(message);
  if (IS_PRODUCTION) {
    electronLog.warn(message);
  }
};

export const error = (message) => {
  timber.error(message);
  if (IS_PRODUCTION) {
    electronLog.error(message);
  }
};

export const info = (message) => {
  timber.info(message);
  if (IS_PRODUCTION) {
    electronLog.info(message);
  }
};
