import { createContext, useContext, useEffect, useState } from "react";
import useActions from "../../lib/useActions";
import useCommands from "../../lib/useCommands";
import useEvents from "../../lib/useEvents";

const DashboardContext = createContext(null);

export function useDashboardContext() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }) {
  const [actionSchemas] = useActions();
  const [events] = useEvents();
  const [commands] = useCommands();
  const [state, setState] = useState({
    actionSchemas: actionSchemas,
    mode: "command",
    commands,
    events,
    handlerIndex: 0,
    actionIndex: 0,
  });

  useEffect(() => {
    if (!commands || !events) return;
    //updateCommandsAndEvents(commands, events);
    setState({ ...state, commands, events });
  }, [JSON.stringify(commands), JSON.stringify(events)]);

  const handlers =
    (state.mode === "event" ? state.events : state.commands) || [];
  const handler = handlers[state.handlerIndex] || {};
  console.log("HandlerIndex after re-render", state.handlerIndex);
  const actions = handler.actions || [];
  const action = actions[state.actionIndex] || {};

  /**
   * @param {string} mode
   */
  const updateMode = (mode) => {
    setState({ ...state, mode, actionIndex: 0, handlerIndex: 0 });
  };

  /**
   * Select new handler
   * @param {number} index
   */
  const updateHandlerIndex = (index) => {
    let newIndex;

    if (handlers[index]) {
      newIndex = index;
    } else if (handlers.length < 1) {
      // Reset if there are no actions
      newIndex = 0;
    } else {
      // Set index to last item
      newIndex = handlers.length - 1;
    }

    console.log("Trying to select: " + newIndex);
    setState({ ...state, handlerIndex: newIndex });
  };

  /**
   * Updates selected handler
   * @param {object} handler
   */
  const updateHandler = (newHandler) => {
    Object.assign(handler, newHandler);
    setState({ ...state });
  };

  /**
   * Adds a new handler
   * @param {object} handler
   */
  const addHandler = (handler) => {
    handlers.push(handler);
    setState({ ...state });
  };

  /**
   * Remove handler
   * @param {number} index
   */
  const removeHandler = (index) => {
    handlers.splice(index, 1);
    setState({ ...state });
  };

  /**
   * Updates selected action
   * @param {number} index - Index of the action
   * @return {undefined}
   */
  function updateActionIndex(index) {
    let newIndex;

    if (actions[index]) {
      newIndex = index;
    } else if (actions.length < 1) {
      // Reset if there are no actions
      newIndex = 0;
    } else {
      // Set index to last item
      newIndex = actions.length - 1;
    }

    console.log("Trying to select: " + newIndex);
    setState({ ...state, actionIndex: newIndex });
  }

  /**
   * Updates selected action
   * @param {object} action - Action object
   * @return {undefined}
   */
  const updateAction = (newAction) => {
    Object.assign(action, newAction);
    setState({ ...state });
  };

  /**
   * Adds a new action
   * @param {object} action - Action object
   * @return {undefined}
   */
  const addAction = (action) => {
    actions.push(action);
    setState({ ...state });
  };

  /**
   * Removes an action
   * @param {number} index - Index of the action
   * @return {undefined}
   */
  const removeAction = (index) => {
    actions.splice(index, 1);
    setState({ ...state });
  };

  return (
    <DashboardContext.Provider
      value={{
        handlers,
        handler,
        actions: actions,
        action,
        ...state,
        updateMode,
        addHandler,
        removeHandler,
        updateHandler,
        updateHandlerIndex,
        addAction,
        removeAction,
        updateAction,
        updateActionIndex,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
