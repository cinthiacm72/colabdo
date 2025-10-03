import mongoose from "mongoose";
import { Types } from "mongoose";
import { connectDB } from "../config/db.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor, ingresa un título."],
    },
    description: {
      type: String,
      default: "Sin descripción.",
    },
    dueDate: {
      type: Date,
      default: Date.now(),
      required: [true, "Por favor, ingresa una fecha."],
      get: (v) => (v ? v.toISOString().slice(0, 10) : null),
    },
    status: {
      type: String,
      enum: ["activa", "inactiva"],
      default: "activa",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["urgente", "importante", "postergable"],
      default: "postergable",
    },
    images: {
      type: [String],
      default: [],
      set: (val) => (Array.isArray(val) ? val.filter(Boolean) : []),
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sharedWith: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      set: (val) => {
        if (Array.isArray(val)) return val.filter(Boolean);
        if (val && typeof val === "object" && val._id) return [val._id];
        return [];
      },
      // Set asegura a través de una función que el valor sea un [] antes de guardarlo en la base de datos. Si val es [] se aplica .filter(Boolean). Boolean(value) convierte los valores en valores true o false. Valores falsy ("",  null, undefined, 0, NaN) son eliminados. Val no es array, devuelve un array
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

const Task = mongoose.model("Task", taskSchema);

const mTask = {
  create: async (task) => {
    try {
      await connectDB();
      const newTask = new Task(task);
      await newTask.save();
      return newTask;
    } catch (err) {
      // Si es un error de validación de Mongoose
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message,
        }));
        const error = new Error("Error de validación.");
        error.status = 400;
        error.details = errors;
        throw error;
      }

      throw err;
    }
  },

  getAll: async (userId, filters = {}) => {
    try {
      await connectDB();

      const tasks = await Task.find({
        $or: [{ user: userId }, { sharedWith: userId }],
        ...filters,
      })
        .sort({ dueDate: 1, createdAt: -1 })
        .populate("user", "name email images")
        .populate("sharedWith", "name email images");
      return tasks;
    } catch (err) {
      throw err;
    }
  },

  countByPriority: async (userId) => {
    try {
      await connectDB();

      const counts = await Task.aggregate([
        {
          $match: {
            $or: [
              { user: new Types.ObjectId(userId) },
              { sharedWith: new Types.ObjectId(userId) },
            ],
          },
        },
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);
      // Convertimos a un objeto más útil, como:
      // { urgente: 3, importante: 5, postergable: 2 }
      const result = {
        urgente: 0,
        importante: 0,
        postergable: 0,
      };

      counts.forEach(({ _id, count }) => {
        result[_id] = count;
      });

      return result;
    } catch (err) {
      throw err;
    }
  },

  countByOverdue: async (userId) => {
    try {
      await connectDB();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await Task.countDocuments({
        $and: [
          {
            $or: [
              { user: new Types.ObjectId(userId) },
              { sharedWith: new Types.ObjectId(userId) },
            ],
          },
          { dueDate: { $lt: today } }, // ahora solo compara la fecha
        ],
      });

      return count;
    } catch (err) {
      throw err;
    }
  },

  countByToday: async (userId) => {
    try {
      await connectDB();

      const start = new Date();
      start.setHours(0, 0, 0, 0); // inicio del día

      const end = new Date();
      end.setHours(23, 59, 59, 999); // fin del día

      const count = await Task.countDocuments({
        $and: [
          {
            $or: [
              { user: new Types.ObjectId(userId) },
              { sharedWith: new Types.ObjectId(userId) },
            ],
          },
          { dueDate: { $gte: start, $lte: end } },
        ],
      });

      return count;
    } catch (err) {
      throw err;
    }
  },

  getOne: async (taskId) => {
    try {
      await connectDB();
      const task = await Task.findById(taskId);
      return task;
    } catch (err) {
      throw err;
    }
  },

  getWithSharedUsers: async (taskId) => {
    try {
      await connectDB();
      const task = await Task.findById(taskId).populate(
        "sharedWith",
        "name email images"
      );
      return task;
    } catch (err) {
      throw err;
    }
  },

  updateOne: async (taskIdToUpdate, updatedTaskData) => {
    try {
      await connectDB();
      const updatedTask = await Task.findByIdAndUpdate(
        taskIdToUpdate,
        { $set: updatedTaskData },
        {
          new: true, // Retorna la tarea actualizada
          runValidators: true, // Ejecuta las validaciones del esquema
        }
      )
        .populate("sharedWith", "name email images")

        .populate("user", "name email images"); ///NEW!!!

      return updatedTask;
    } catch (err) {
      // Si es un error de validación de Mongoose
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message,
        }));
        const error = new Error("Error de validación.");
        error.status = 400;
        error.details = errors;
        throw error;
      }
      throw err;
    }
  },

  complete: {},

  uncomplete: {},

  deleteOne: async (taskId) => {
    try {
      await connectDB();
      // Verifica si el ID es válido antes de convertirlo
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error("ID de tarea no válido.");
      }
      await Task.findByIdAndDelete(taskId);
    } catch (err) {
      throw err;
    }
  },
};

export default mTask;
