import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  //user: JSON.parse(localStorage.getItem("user")) || null,
  user: null,
  //loading: false,
  loading: true,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "REQUEST_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "REQUEST_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      // ✅ AGREGAR: Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        user: null,
        loading: false,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Verificar token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          throw new Error("Token inválido");
        }

        const user = await res.json();
        dispatch({ type: "REQUEST_SUCCESS", payload: user });
      } catch (err) {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  // Guardar user en localStorage al cambiar
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
