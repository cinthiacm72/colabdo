import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ButtonLogout = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();

    dispatch({ type: "REQUEST_START" });

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": import.meta.env.VITE_CLIENT_URL,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      dispatch({ type: "LOGOUT", payload: data });
    } catch (err) {
      dispatch({ type: "REQUEST_FAILURE", payload: err });
    }
  };

  return (
    <button
      className="button-outline-l button-outline-l-accent"
      onClick={handleLogout}
    >
      Salir
    </button>
  );
};

export default ButtonLogout;
