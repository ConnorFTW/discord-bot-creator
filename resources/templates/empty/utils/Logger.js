export default class Logger {
  getLogPosition(data, cache) {
    const type =
      data.permissions || data.restriction || !data["event-type"]
        ? "command"
        : "event";

    return `${cache.handlerIndex}:${cache.index}`;
  }

  getErrorString(data, cache) {
    const type =
      data.permissions || data.restriction || !data["event-type"]
        ? "command"
        : "event";

    return cache.handlerIndex ? `[err:${this.getLogPosition(data, cache)}]` : `Error with ${type} "${data.name}"`;
  }

  /**
   * Parses error, logs it, and passes it to Event.onError
   * @param {Object} data
   * @param {Object} cache
   * @param {Error} e
   * @returns {void}
   */
  displayError(data, cache, err) {
    const error = this.getErrorString(data, cache);
    this.Events.onError(error, err.stack ? err.stack : err, cache);
    if (process.send) {
      process.send({
        message: err?.message || err,
        type: "error",
        handlerIndex: cache.handlerIndex,
        actionIndex: cache.index,
      });
    } else {
      console.error(error + ":\n" + err);
    }
  }
}
