import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;
// Write the same for events

export default function useEvents({ force } = {}) {
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined" && window.__events) {
      return window.__events;
    }

    return null;
  });

  useEffect(() => {
    if (events) {
      window._events = events;
    }
  }, [events]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window._events || (window._events && !force)) return;

    ipcRenderer?.once("getEvents", (event, events) => {
      events = JSON.parse(events || "[]");
      window._events = events;
      setEvents(events);
    });

    ipcRenderer?.send("getEvents");
  }, [typeof window]);

  return [events?.filter((c) => c), setEvents];
}
