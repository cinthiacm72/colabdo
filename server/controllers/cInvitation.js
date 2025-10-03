import { createError } from "../middelwares/error.js";
import mInvitation from "../models/mInvitation.js";

const cInvitation = {
  /*   exists: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { senderId } = req.body;

      await mInvitation.validate(userId, senderId);

      if (existingInvitation) {
        return res
          .status(200)
          .json({ message: `Ya has enviado una invitación a ${userId}.` });
      }
    } catch (err) {
      return next();
    }
  },
 */
  /*  create: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { senderId } = req.body;

      const invitation = await mInvitation.create(userId, senderId);

      //await mInvitation.create(req.body.senderId, req.params.userId);

      console.log(invitation);

      res.status(201).json({ message: `Invitación enviada a ${userId}.` });
    } catch (err) {
      return next();
    }
  }, */
};

export default cInvitation;
