import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

const invitationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      /* required: true, */
    },
    ceatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

const mInvitation = {
  validate: async (senderId, userId) => {
    try {
      await connectDB();
      const existingInvitation = await Invitation.findOne({
        senderId,
        receiverId: userId,
        status: "pending",
      });

      return existingInvitation;
    } catch (err) {
      throw err;
    }
  },

  create: async (senderId, userId) => {
    try {
      await connectDB();
      const newInvitation = new Invitation({
        senderId,
        receiverId: userId,
      });

      await newInvitation.save();
    } catch (err) {
      throw err;
    }
  },

  reject: async (senderId, userId) => {
    try {
      await connectDB();
      const invitation = await Invitation.findOneAndUpdate(
        { senderId, receiverId: userId, status: "pending" },
        { status: "rejected" },
        { new: true }
      );
      await Invitation.findByIdAndDelete(invitation._id);
    } catch (err) {
      throw err;
    }
  },
};

export default mInvitation;
