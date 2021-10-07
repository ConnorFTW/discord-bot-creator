import electron from "electron";

import { useEffect, useState } from "react";

const ipcRenderer = electron.ipcRenderer || null;
// Write the same for events

export default function useEvents({ force } = {}) {
  const [events, _setEvents] = useState(() => {
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
      if (typeof events === "string") {
        events = JSON.parse(events || "[]");
      }
      window._events = events;
      _setEvents(events);
    });

    ipcRenderer?.send("getEvents");
  }, [typeof window]);


  const setEvents = async (events) => {
    return new Promise((resolve, reject) => {
      console.log("Trying to save events");
      console.log(events);
      ipcRenderer?.send("saveEvents", events);
      ipcRenderer?.once("saveEvents", (event, response) => {
        if (!response.success) {
          console.error("Failed to save");
          return reject("Failed to save");
        }
        let events = response.events;
        window._events = events || [];
        _setEvents(events);
        resolve(events);
      });
    });
  };

  return [events?.filter((c) => c), setEvents];
}
