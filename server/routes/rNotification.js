import { Router } from "express";
import { protect } from "../middlewares/protect.js";
import mNotification from "../models/mNotification.js";

const routes = Router();

routes.get("/notifications", protect, async (req, res, next) => {
  try {
    const notes = await mNotification.getForUser(req.user._id);
    res.json({ ok: true, notifications: notes });
  } catch (err) {
    next(err);
  }
});

routes.post("/notifications/:id/read", protect, async (req, res, next) => {
  try {
    const updated = await mNotification.markRead(req.params.id);
    res.json({ ok: true, notification: updated });
  } catch (err) {
    next(err);
  }
});

export default routes;
