import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FormMessages from "../components/FormMessages";
import ButtonGoBack from "../components/ButtonGoBack";

const Register = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    lastname: "",
  });

  const [message, setMessage] = useState(null);

  const [files, setFiles] = useState([]);

  const { loading, error, dispatch } = useContext(AuthContext);

  const uploadUserImage = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return [];

    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/upload/user`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al subir imagen");
      }

      const data = await res.json();
      return data.urls || "";
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    dispatch({ type: "REQUEST_START" });

    let urlFiles = [];

    try {
      urlFiles = await uploadUserImage(files);

      const newUser = {
        ...inputs,
        images: urlFiles,
      };

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.message);
        err.status = res.status;
        throw err;
      }

      setMessage({
        status: "success",
        message: data.message,
        details: data.details || [],
      });
      dispatch({ type: "REGISTER_SUCCESS", payload: data });
      console.log("PAYLOAD ", data);

      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } catch (err) {
      if (urlFiles.length > 0) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: urlFiles }),
        });
      }

      console.log(err);

      setMessage({
        status: "error",
        message: err.message || "Error en el registro",
        details: [],
      });

      dispatch({ type: "REQUEST_FAILURE", payload: err });
    }
  };

  return (
    <section className="container-fluid-s">
      <ButtonGoBack />
      <h1 className="margin-bottom-4 fs-x-huge bold text-white">
        Por favor, registrate.
      </h1>
      <form
        className="flex flex-column flex-gap-4 margin-bottom-4"
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <div className="flex flex-gap-2">
          {files.length > 0 ? (
            files.map((file, index) => (
              <img
                key={index}
                className="user-avatar-m"
                src={URL.createObjectURL(file)}
                alt="User avatar"
              />
            ))
          ) : (
            <img
              className="user-avatar-m"
              src="/assets/imgs/default-avatar.png"
              alt="User avatar"
            />
          )}
          <label htmlFor="file">
            Upload image:
            <input
              type="file"
              id="file"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </label>
        </div>
        <label className="flex flex-column">
          Nombre de usuario:
          <input
            type="text"
            id="username"
            required
            value={inputs.username}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label className="flex flex-column">
          Contraseña:
          <input
            type="password"
            id="password"
            required
            value={inputs.password}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label className="flex flex-column">
          Correo Electrónico:
          <input
            type="text"
            id="email"
            required
            value={inputs.email}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label className="flex flex-column">
          Nombre:
          <input
            type="text"
            id="name"
            required
            value={inputs.name}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label className="flex flex-column">
          Apellidos:
          <input
            type="text"
            id="lastname"
            required
            value={inputs.lastname}
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        <button
          className="button-solid-l button-solid-l-accent"
          type="submit"
          disabled={loading}
          onClick={handleRegistration}
        >
          {loading ? "Cargando..." : "Registrarme"}
        </button>
      </form>

      <FormMessages message={message} />
    </section>
  );
};

export default Register;
