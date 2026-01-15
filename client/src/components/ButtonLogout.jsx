import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";

const ButtonLogout = () => {
  const { dispatch } = useContext(AuthContext);
  const { disconnectSocket } = useContext(TaskContext);

  const handleLogout = async (e) => {
    e.preventDefault();

    dispatch({ type: "REQUEST_START" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/logout", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      console.log("Logout response:", data);

      // Borrar token en cliente (logout local)
      // localStorage.removeItem("token");

      dispatch({ type: "LOGOUT", payload: data });
    } catch (err) {
      dispatch({ type: "REQUEST_FAILURE", payload: err });
    } finally {
      if (disconnectSocket) disconnectSocket();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
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
