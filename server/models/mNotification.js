import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String },
    read: { type: Boolean, default: false },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// TTL: eliminar notificaciones 30 días después de createdAt
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }
);

// evita error de re-compilación en Vercel
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

const mNotification = {
  create: async (payload) => {
    await connectDB();
    const n = new Notification(payload);
    await n.save();
    return n;
  },
  getForUser: async (userId) => {
    await connectDB();
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  },
  markRead: async (id) => {
    await connectDB();
    return Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    ).lean();
  },
};

export default mNotification;
