import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";

const ModalContentUpdate = ({
  taskIdToUpdate,
  data,
  setData,
  onClose,
  setClosing,
}) => {
  const { loading, error, dispatch } = useContext(TaskContext);

  // ✅ Obtener el token una sola vez al inicio
  const token = localStorage.getItem("token");

  const currentTask = data.find((task) => task._id === taskIdToUpdate);

  const [currentTaskToUpdate, setCurrentTaskToUpdate] = useState({
    title: currentTask.title,
    description: currentTask.description,
    status: currentTask.status,
    completed: currentTask.completed,
    priority: currentTask.priority,
    dueDate: currentTask.dueDate ? currentTask.dueDate.slice(0, 10) : "",
  });

  const [message, setMessage] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const validateForm = (currentTaskToUpdate) => {
    const errors = {};

    if (!currentTaskToUpdate.title) errors.title = "El título es obligatorio.";

    if (!currentTaskToUpdate.dueDate) {
      errors.dueDate = "La fecha límite es requerida.";
    } else {
      const [y, m, d] = currentTaskToUpdate.dueDate.split("-");
      const due = new Date(Number(y), Number(m) - 1, Number(d));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (due < today)
        errors.dueDate = "La fecha límite no puede ser en el pasado.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === "completed" ? value === "true" : value;

    setCurrentTaskToUpdate((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    const errors = validateForm(currentTaskToUpdate);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    setMessage("");

    try {
      const updatedTask = {
        ...currentTaskToUpdate,
      };

      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/task/update/${taskIdToUpdate}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!res.ok) {
        const data = await res.json();

        const err = new Error(data.message || "Error al crear la tarea.");

        err.status = res.status;

        err.details = data.details || [];

        throw err;
      }

      const data = await res.json();

      // Actualiza la variable data para que actualice la UI
      setData((prevData) =>
        prevData.map((item) => (item._id === data._id ? data : item))
      );

      setMessage(data.message);

      dispatch({ type: "REQUEST_SUCCESS", payload: data.message });

      // Cierra el modal
      setClosing(true);
      setTimeout(() => {
        if (onClose) onClose();
        setClosing(false);
      }, 400); // mismo tiempo que la animación
    } catch (err) {
      setMessage({
        message: err.message,
        status: err.status,
        details: err.details || [],
      });

      dispatch({ type: "REQUEST_FAILURE", payload: err });
    }

    dispatch({ type: "RESET_FORM" });
  };

  return (
    <section className="modal text-white">
      <h2 className="fs-large bold margin-bottom-4">Editar Tarea</h2>

      <form
        className="flex flex-column flex-gap-4 margin-bottom-4"
        onSubmit={handleUpdateTask}
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <label className="flex flex-column">
          Título de la tarea
          <input
            type="text"
            id="title"
            value={currentTaskToUpdate.title}
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
            value={currentTaskToUpdate.description}
            onChange={handleChange}
            disabled={loading}
          ></textarea>
        </label>
        <div className="flex flex-gap-4">
          <label className="flex flex-column">
            Completada
            <select
              id="completed"
              value={currentTaskToUpdate.completed.toString()}
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
              value={currentTaskToUpdate.status}
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
            value={currentTaskToUpdate.priority}
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
            value={currentTaskToUpdate.dueDate || ""}
            onChange={handleChange}
            disabled={loading}
          />
          {formErrors.dueDate && <span>{formErrors.dueDate}</span>}
        </label>

        <button
          className="button-solid-l button-solid-l-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Editar Tarea"}
        </button>
      </form>
    </section>
  );
};

export default ModalContentUpdate;
