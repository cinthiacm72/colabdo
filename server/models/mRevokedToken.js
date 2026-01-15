import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const revokedSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Si expiresAt está presente, Mongo eliminará el documento al llegar a expiresAt
revokedSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RevokedToken = mongoose.model("RevokedToken", revokedSchema);

const mRevokedToken = {
  add: async (token) => {
    await connectDB();
    let expiresAt = null;
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) expiresAt = new Date(decoded.exp * 1000);
    } catch (err) {
      expiresAt = null;
    }
    // Upsert para evitar errores si se intenta revocar dos veces
    return RevokedToken.findOneAndUpdate(
      { token },
      { token, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  },

  exists: async (token) => {
    await connectDB();
    const doc = await RevokedToken.findOne({ token }).lean();
    return Boolean(doc);
  },
};

export default mRevokedToken;
