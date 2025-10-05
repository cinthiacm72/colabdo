import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputPassword from "../components/InputPassword";
import FormMessages from "../components/FormMessages";
import ButtonGoBack from "../components/ButtonGoBack";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch({ type: "REQUEST_START" });

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
        method: "POST",
        // ❌ ELIMINADO: credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw {
          status: data.status,
          message: data.message,
          details: data.details || [],
        };
      }

      // ✅ NUEVO: Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ NUEVO: Guardar el usuario en localStorage (opcional, ya lo tienes en el contexto)
      localStorage.setItem("user", JSON.stringify(data.details));

      setMessage({
        status: "success",
        message: data.message,
        details: data.details || [],
      });

      dispatch({
        type: "REQUEST_SUCCESS",
        payload: data.details,
      });

      navigate("/");
    } catch (err) {
      setMessage({
        status: "error",
        message: err.message,
        details: err.details,
      });

      dispatch({
        type: "REQUEST_FAILURE",
        payload: {
          status: "error",
          message: err.message,
          details: err.details,
        },
      });
    }
  };

  return (
    <>
      <section className="container-fluid-s">
        <ButtonGoBack />
        <h1 className="fs-x-large bold text-white">¡Bienvenido a ColabDo!</h1>
        <p className="margin-bottom-6">Ingresa tus datos.</p>
        <form className="flex flex-column flex-gap-4 margin-bottom-4">
          <label className="flex flex-column">
            Usuario:
            <input
              type="text"
              id="username"
              required
              value={credentials.username}
              onChange={handleChange}
            />
          </label>
          <InputPassword
            credentials={credentials}
            handleChange={handleChange}
          />
          <button
            className="button-solid-l button-solid-l-accent"
            type="submit"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <FormMessages message={message} />
      </section>
    </>
  );
};

export default Login;
