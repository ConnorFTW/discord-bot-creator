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
    handlers: [],
    handler: {},
    handlerIndex: 0,
    actions: [],
    action: {},
    actions,
    commands,
    events,
    actionIndex: 0,
    actionSchemas: actions,
  });

  useEffect(() => {
    if (state.mode === "command") {
      updateHandlers(state.commands || []);
    } else {
      updateHandlers(state.events || []);
    }
  }, [state.mode]);

  function updateMode(mode) {
    setState({ ...state, mode });
  }

  function updateHandlers(handlers) {
    console.log({ handlers });
    // Choose last item if doesn't exist in list
    if (!handlers[state.handlerIndex]) {
      const lastIndex = handlers.length - 1;
      const handler = handlers[lastIndex] || {};
      setState({
        ...state,
        handlers,
        handler,
        actions: handler.actions || [],
        handlerIndex: lastIndex < 0 ? 0 : lastIndex,
      });
    } else {
      setState({
        ...state,
        handlers,
        handler: handlers[state.handlerIndex],
      });
    }
  }

  function updateHandlerIndex(index) {
    setState({
      ...state,
      handlerIndex: index,
      actionIndex: state.handlers[state.handlerIndex]?.[index] ? index : 0,
      actions:
        state.handlers[state.handlerIndex]?.[index]?.actions ||
        state.handlers[state.handlerIndex]?.[0]?.actions ||
        [],
      handler: state.handlers[state.handlerIndex] || {},
    });
  }

  function updateActions(actions) {
    // Choose last action if doesn't exist in list
    if (!actions[state.actionIndex]) {
      const lastIndex = actions.length - 1;
      setState({
        ...state,
        actions,
        action: actions[lastIndex] || {},
        actionIndex: lastIndex < 0 ? 0 : lastIndex,
      });
    } else {
      setState({
        ...state,
        action,
        action: actions[state.actionIndex],
      });
    }
  }

  function updateActionIndex(index) {
    setState({ ...state, actionIndex: index });
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
