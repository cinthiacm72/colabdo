import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  task: null,
  loading: false,
  error: null,
};

export const TaskContext = createContext(INITIAL_STATE);

const TaskReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_START":
      return {
        task: null,
        loading: true,
        error: null,
      };

    case "REQUEST_SUCCESS":
      return {
        task: action.payload,
        loading: true,
        error: null,
      };

    case "REQUEST_FAILURE":
      return {
        task: null,
        loading: false,
        error: action.payload,
      };

    case "RESET_FORM":
      return { task: null, loading: false, error: null };

    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TaskReducer, INITIAL_STATE);

  return (
    <TaskContext.Provider
      value={{
        task: state.task,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
