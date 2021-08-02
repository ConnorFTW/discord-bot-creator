import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;

export default function useEvents({ force } = {}) {
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined" && window.__events) {
      return window.__events;
    }

    return null;
  });

  useEffect(() => {
    ipcRenderer?.on("getEvents", (event, events) => {
      events = JSON.parse(events || "[]");
      window._events = events;
      setEvents(events);
    });
    if (events && !force) return;
    ipcRenderer?.send("getEvents");

    return () => {
      ipcRenderer?.removeAllListeners("getEvents");
    };
  }, [!!ipcRenderer, events]);

  return [events?.filter((e) => e), setEvents];
}
