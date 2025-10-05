import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import FormMessages from "./FormMessages";

const ModalContentCreate = ({ setData, onClose, setClosing }) => {
  const { loading, error, dispatch } = useContext(TaskContext);

  const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "activa",
    completed: false,
    priority: "postergable",
    dueDate: "",
    images: "",
    sharedWith: [],
  });

  const [message, setMessage] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const [files, setFiles] = useState([]);

  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const validateForm = (task) => {
    const errors = {};

    if (!task.title) errors.title = "El título es obligatorio.";

    if (!task.dueDate) errors.dueDate = "La fecha límite es requerida.";

    if (!task.dueDate) {
      errors.dueDate = "La fecha límite es requerida.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // medianoche de hoy

      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0); // medianoche de la fecha límite

      if (due < today)
        errors.dueDate = "La fecha límite no puede ser en el pasado.";
    }

    return errors;
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + `/users?query=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {}
    };

    fetchSuggestions();
  }, [search]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    const newValue = id === "completed" ? value === "true" : value;

    setTask((prev) => ({ ...prev, [id]: newValue }));
  };

  const uploadImages = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return [];

    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/upload/task`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al subir imágenes");
      }

      const data = await res.json();
      return data.urls || [];
    } catch (err) {
      throw err;
    }
  };

  const handleNewTask = async (e) => {
    e.preventDefault();

    const errors = validateForm(task);

    if (Object.keys(errors).length > 0) setFormErrors(errors);

    setMessage(null);

    let urlFiles = [];

    try {
      urlFiles = await uploadImages(files);

      const newTask = {
        ...task,
        images: urlFiles,
      };

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/task/new", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const data = await res.json();

        throw {
          status: res.status,
          message: data.message,
          details: data.details || [],
        };
      }

      const data = await res.json();

      setMessage({
        status: "success",
        message: data.message,
        details: [],
      });

      dispatch({ type: "REQUEST_SUCCESS", payload: data.message });

      // Actualiza la variable data para que actualice la UI
      setData((prevData) => [data.newTaskWithId, ...prevData]);

      // Cierra el modal
      setClosing(true);
      setTimeout(() => {
        if (onClose) onClose();
        setClosing(false);
      }, 3500); // mismo tiempo que la animación
    } catch (err) {
      if (urlFiles.length > 0) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload/delete`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ files: urlFiles }),
        });
      }

      setMessage({
        status: "error",
        message: err.message || "Error al crear la tarea",
        details: err.details || [],
      });
      dispatch({
        type: "REQUEST_FAILURE",
        payload: {
          status: "error",
          message: err.message || "Error al crear la tarea",
          details: err.details || [],
        },
      });
    }

    dispatch({ type: "RESET_FORM" });
  };

  return (
    <section className="modal text-white">
      <h2 className="fs-large bold">Crear una Tarea</h2>

      <div className="flex flex-wrap flex-gap-sm margin-top-4 margin-bottom-2">
        {files.length > 0 ? (
          files.map((file, index) => (
            <img
              key={index}
              style={{ width: "80px", height: "80px" }}
              src={URL.createObjectURL(file)}
              alt=""
            />
          ))
        ) : (
          <img
            style={{ width: "80px", height: "80px" }}
            src="/assets/imgs/default-image.png"
            alt=""
          />
        )}
      </div>
      <form
        className="flex flex-column flex-gap-4 margin-bottom-4"
        onSubmit={handleNewTask}
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <label className="flex flex-column">
          Upload images
          <input
            type="file"
            id="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </label>
        <label className="flex flex-column">
          Título de la tarea
          <input
            type="text"
            id="title"
            value={task.title}
            onChange={handleChange}
            disabled={loading}
          />
          {formErrors.title && <span>{formErrors.title}</span>}
        </label>
        <label className="flex flex-column">
          Descripción de la tarea
          <textarea
            name="description"
            id="description"
            value={task.description}
            onChange={handleChange}
            disabled={loading}
          ></textarea>
        </label>
        <div className="flex flex-gap-4">
          <label className="flex flex-column">
            Completada
            <select
              id="completed"
              value={task.completed.toString()}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="false">No</option>
              <option value="true">Si</option>
            </select>
          </label>

          <label className="flex flex-column">
            Status
            <select
              id="status"
              value={task.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </label>
        </div>
        <label className="flex flex-column">
          Prioridad
          <select
            id="priority"
            value={task.priority}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="postergable">Postergable</option>
            <option value="importante">Importante</option>
            <option value="urgente">Urgente</option>
          </select>
        </label>

        <label className="flex flex-column">
          Fecha límite
          <input
            type="date"
            id="dueDate"
            value={task.dueDate || ""}
            onChange={handleChange}
            disabled={loading}
          />
          {formErrors.dueDate && <span>{formErrors.dueDate}</span>}
        </label>

        <label className="flex flex-column">
          Compartir con
          <input
            type="text"
            name="userSearch"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </label>
        {/* Sugerencia de usuarios */}
        <ul className="reset-list">
          {Array.isArray(suggestions) &&
            suggestions.map((user) => (
              <li
                className="cursor"
                key={user.value}
                onClick={() => {
                  if (!task.sharedWith.includes(user.value)) {
                    setTask((prev) => ({
                      ...prev,
                      sharedWith: [...prev.sharedWith, user.value],
                    }));
                    setSelectedUsers((prev) => [...prev, user]);
                  }
                  setSearch("");
                  setSuggestions([]);
                }}
              >
                <div className="fs-small margin-top-2">
                  <span>{user.label}</span>
                </div>
              </li>
            ))}
        </ul>
        {/* Usuarios ya seleccionados */}
        {selectedUsers.length > 0 && (
          <div className="box bg-black">
            <p className="bold">Compartido con:</p>
            <ul className="reset-list">
              {selectedUsers.map((user) => (
                <li
                  className="flex flex-a-center margin-top-4"
                  key={user.value}
                >
                  <div>
                    <span className="text-accent">{user.label}</span>
                  </div>
                  <button
                    className="button-solid-s button-solid-s-white"
                    style={{ marginLeft: "6px" }}
                    type="button"
                    onClick={() => {
                      setTask((prev) => ({
                        ...prev,
                        sharedWith: prev.sharedWith.filter(
                          (id) => id !== user.value
                        ),
                      }));
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.value !== user.value)
                      );
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="button-solid-l button-solid-l-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Enviar nueva Tarea"}
        </button>
      </form>
      <FormMessages message={message || error} />
    </section>
  );
};

export default ModalContentCreate;
