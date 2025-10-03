import { createError } from "../middlewares/error.js";
import mTask from "../models/mTask.js";

// Función helper para convertir YYYY-MM-DD a medianoche local
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

const cTask = {
  new: async (req, res, next) => {
    try {
      const {
        title,
        description,
        dueDate,
        status,
        completed,
        priority,
        images,
        sharedWith,
      } = req.body;

      // Validación básica de campos
      const err = [];
      if (!title)
        err.push({ field: "title", message: "El título es obligatorio." });
      if (!dueDate)
        err.push({
          field: "dueDate",
          message: "La fecha límite es requerida.",
        });

      if (err.length > 0) {
        return next(createError(400, "Faltan campos obligatorios", err));
      }

      const due = parseLocalDate(dueDate);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (due < today) {
        return next(
          createError(400, "La fecha límite no puede ser en el pasado.", [
            {
              field: "dueDate",
              message: "La fecha límite no puede ser en el pasado.",
            },
          ])
        );
      }

      const createdTask = await mTask.create({
        title,
        description,
        dueDate: due, // ahora guarda el día correcto
        status,
        completed,
        priority,
        images,
        user: req.user._id,
        sharedWith,
      });

      // Ahora hacemos el populate manualmente
      const newTaskWithId = await mTask.getWithSharedUsers(createdTask._id);

      if (!newTaskWithId) {
        return next(
          createError(
            404,
            "No se pudo encontrar los usuarios compartidos de la tarea."
          )
        );
      }

      // Retornas newTaskWithId para el componente ModalNewTask que requiere el _.id
      return res
        .status(201)
        .json({ message: "La tarea ha sido creada.", newTaskWithId });
    } catch (err) {
      return next(
        createError(
          err.status || 500,
          err.message || "Error al crear la tarea.",
          err.details
        )
      );
    }
  },

  update: async (req, res, next) => {
    try {
      const {
        title,
        description,
        dueDate,
        status,
        completed,
        priority,
        images,
      } = req.body;

      // Validación básica de campos
      const err = [];
      if (!title)
        err.push({ field: "title", message: "El título es obligatorio." });
      if (!dueDate)
        err.push({
          field: "dueDate",
          message: "La fecha límite es requerida.",
        });

      if (err.length > 0) {
        return next(createError(400, "Faltan campos obligatorios", err));
      }

      const due = parseLocalDate(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (due < today) {
        return next(
          createError(400, "La fecha límite no puede ser en el pasado.", [
            {
              field: "dueDate",
              message: "La fecha límite no puede ser en el pasado.",
            },
          ])
        );
      }

      const updatedTask = await mTask.updateOne(req.params.taskIdToUpdate, {
        title,
        description,
        dueDate: due,
        status,
        completed,
        priority,
        images,
      });

      return res.status(200).json(updatedTask);
    } catch (err) {
      return next(
        createError(
          err.status || 500,
          err.message || "Error al actualizar la tarea.",
          err.details
        )
      );
    }
  },

  all: async (req, res, next) => {
    try {
      // Creación filtros dinámicamente
      let filters = { ...req.query };

      if (filters.overdue === "true") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.dueDate = { $lt: today };
      }

      if (filters.today === "true") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        filters.dueDate = { $gte: start, $lte: end };
      }

      // Elimino el filtro 'overdue' ya que no es un campo del modelo
      delete filters.overdue;
      delete filters.today;

      const tasks = await mTask.getAll(req.user._id, filters);
      res.status(200).json(tasks);
    } catch (err) {
      next(createError(500, "Error al obtener las tareas."));
    }
  },

  priorityCount: async (req, res, next) => {
    try {
      const counts = await mTask.countByPriority(req.user._id);
      res.status(200).json(counts);
    } catch (err) {
      next(createError(500, "Error al contar las tareas por prioridad."));
    }
  },

  overdueCount: async (req, res, next) => {
    try {
      const count = await mTask.countByOverdue(req.user._id);
      res.status(200).json(count);
    } catch (err) {
      next(createError(500, "Error al contar las tareas vencidas."));
    }
  },

  todayCount: async (req, res, next) => {
    try {
      const count = await mTask.countByToday(req.user._id);
      res.status(200).json(count);
    } catch (err) {
      next(createError(500, "Error al contar las tareas que vencen hoy."));
    }
  },

  one: {},

  deletion: async (req, res, next) => {
    try {
      const task = await mTask.getOne(req.params.taskId);
      if (!task) {
        return next(
          createError(
            404,
            "No se pudo eliminar la tarea porque no se encontró."
          )
        );
      }

      await mTask.deleteOne(req.params.taskId);
      res.status(200).json({ message: "La tarea ha sido eliminada." });
    } catch (err) {
      return next(createError(500, "Error al eliminar la tarea."));
    }
  },
};

export default cTask;
