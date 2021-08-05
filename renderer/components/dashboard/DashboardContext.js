import { createContext, useContext, useEffect, useState } from "react";
import useActions from "../../lib/useActions";
import useCommands from "../../lib/useCommands";
import useEvents from "../../lib/useEvents";

const DashboardContext = createContext(null);

export function useDashboardContext() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }) {
  const [actions] = useActions();
  const [events] = useEvents();
  const [commands] = useCommands();
  const [state, setState] = useState({
    mode: "command",
    commands,
    events,
    handlers: [],
    handler: {},
    handlerIndex: 0,
    actions: [],
    action: {},
    actions,
    actionIndex: 0,
    actionSchemas: actions,
  });

  useEffect(() => {
    if (commands && events) {
      if (JSON.stringify(commands) !== JSON.stringify(state.commands)) {
        updateCommandsAndEvents(commands, events);
      } else if (JSON.stringify(events) !== JSON.stringify(state.events)) {
        updateCommandsAndEvents(commands, events);
      }
    }
  }, [!!commands, !!events]);

  // Every function checks and changes it's own value
  // Then it calls the function below it
  function updateMode(mode, _state = state) {
    _state = { ..._state, mode: mode || _state.mode };

    if (_state.mode === "event") {
      updateHandlers(_state.events, _state);
    } else {
      updateHandlers(_state.commands, _state);
    }
  }

  function updateCommandsAndEvents(commands, events, _state = state) {
    _state = {
      ..._state,
      commands: commands || _state.commands,
      events: events || _state.events,
    };

    if (_state.mode === "event") {
      updateHandlers(_state.events, _state);
    } else {
      updateHandlers(_state.commands, _state);
    }
  }

  function updateHandlers(handlers, _state = state) {
    _state = { ..._state, handlers: handlers || [] };
    updateHandlerIndex(_state.handlerIndex, _state);
  }

  function updateHandlerIndex(index, _state = state) {
    const newIndex = _state.handlers[index]
      ? index
      : _state.handlers.length
      ? _state.handlers.length - 1
      : 0;
    _state = { ..._state, handlerIndex: newIndex };
    updateHandler(_state.handlers[newIndex] || {}, _state);
  }

  function updateHandler(handler, _state = state) {
    _state = { ..._state, handler, actions: handler.actions || [] };
    updateActions(_state.actions, _state);
  }

  function updateActions(actions, _state = state) {
    _state = { ..._state, actions };
    updateActionIndex(_state.actionIndex, _state);
  }

  useEffect(() => {
    const actions = [...state.actions, "test"];
    updateActions(actions);
  }, []);

  function updateActionIndex(index, _state = state) {
    const newIndex = _state.actions[index]
      ? index
      : _state.actions.length
      ? _state.actions.length - 1
      : 0;
    setState({ ..._state, actionIndex: newIndex });
  }

  return (
    <DashboardContext.Provider
      value={{
        updateMode,
        updateActions,
        updateActionIndex,
        updateHandlers,
        updateHandlerIndex,
        ...state,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
