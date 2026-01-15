import { createContext, useReducer, useEffect, useRef } from "react";
import createSocket from "../utils/socketClient.js";

const INITIAL_STATE = {
  task: null,
  loading: false,
  error: null,
  notications: [],
};

export const TaskContext = createContext(INITIAL_STATE);

const TaskReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, task: null, loading: true, error: null };

    case "REQUEST_SUCCESS":
      return { ...state, task: action.payload, loading: true, error: null };

    case "REQUEST_FAILURE":
      return { ...state, task: null, loading: false, error: action.payload };

    case "RESET_FORM":
      return { ...state, task: null, loading: false, error: null };

    case "NEW_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };

    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TaskReducer, INITIAL_STATE);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = createSocket(token);
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket conectado", socket.id);
    });

    const onNotification = (data) => {
      console.log("Notif recibida:", data);
      dispatch({ type: "NEW_NOTIFICATION", payload: data });

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(data.title || "Notificación", {
            body: data.body || "",
            data: data.meta || {},
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification(data.title || "Notificación", {
                body: data.body || "",
                data: data.meta || {},
              });
            }
          });
        }
      }
    };

    socket.on("notification", onNotification);

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("notification", onNotification);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      /* socket.off("notification");
      socket.disconnect();
      socketRef.current = null; */
    };
  }, [dispatch]);

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        task: state.task,
        loading: state.loading,
        error: state.error,
        notifications: state.notifications,
        dispatch,
        disconnectSocket,
        socket: socketRef.current,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
