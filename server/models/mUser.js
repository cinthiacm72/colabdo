import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio."],
      unique: true /* ya es único, no se necesita crear un índice para de mejora búsquedas) */,
      match: [/.+@.+\..+/, "Correo electrónico no válido."],
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
      set: (val) => (Array.isArray(val) ? val.filter(Boolean) : []),
    },

    invitationsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Usuarios invitados

    invitationsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ], // Invitaciones recibidas
    sharedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Tareas compartidas
  },

  { timestamps: true }
);

// Mejora de la seguridad - Agregar middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Evita volver a hashear si la contraseña no cambia

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Definir índices después de middleware y antes de exportar el modelo
// userSchema.index({ name: "text", email: "text" })//Útil para búsquedas tipo buscador general: "buscar usuarios que mencionen 'marketing'". No útil para autocompletado o coincidencias parciales como "leo" para encontrar "Leonardo".
userSchema.index({ name: 1, email: 1 }); //Para búsquedas con $regex, los índices simples o compuestos son mejores

const User = mongoose.model("User", userSchema);

const mUser = {
  create: async (user) => {
    try {
      await connectDB();
      const newUser = new User(user);
      await newUser.save();
    } catch (err) {
      throw err; // Lanza el error para que lo maneje el controlador incluyendo las validaciones del esquema de mongoose en el email.
    }
  },

  getOneById: async (userId) => {
    try {
      await connectDB();
      const user = await User.findById(userId).select("-password");
      return user;
    } catch (err) {
      throw err;
    }
  },

  /* .lean() devuelve un objeto JSON plano en lugar de una instancia de Mongoose, lo que hace las consultas más rápidas y reduce el uso de memoria. */

  getOne: async (username) => {
    try {
      await connectDB();
      const user = await User.findOne({ username });
      return user;
    } catch (err) {
      throw err;
    }
  },

  searchByQuery: async (query, currentUserId) => {
    try {
      await connectDB();
      const user = await User.find({
        $or: [
          { email: new RegExp(query, "i") },
          { name: new RegExp(query, "i") },
        ],

        _id: { $ne: currentUserId }, // <-- necesitás pasarlo desde el controlador
      })
        .select("-password")
        .limit(10)
        .lean();

      return user;
    } catch (err) {
      throw err;
    }
  },

  sendInvitation: async (senderId, userId) => {
    try {
      await connectDB();
      /*   await User.findByIdAndUpdate(senderId, {
        $push: { invitationsSent: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { invitationsReceived: senderId },
      }); */

      await Promise.all([
        User.findByIdAndUpdate(senderId, {
          $push: { invitationsSent: userId },
        }),
        User.findByIdAndUpdate(userId, {
          $push: { invitationsReceived: senderId },
        }),
      ]);
    } catch (err) {
      throw err;
    }
  },

  deleteInvitation: async (senderId, userId) => {
    try {
      await connectDB();
      /*  await User.findByIdAndUpdate(senderId, {
        $pull: { invitationsSent: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { invitationsReceived: senderId },
      }); */
      await Promise.all([
        User.findByIdAndUpdate(senderId, {
          $pull: { invitationsSent: userId },
        }),
        User.findByIdAndUpdate(userId, {
          $pull: { invitationsReceived: senderId },
        }),
      ]);
    } catch (err) {
      throw err;
    }
  },
};

export default mUser;
