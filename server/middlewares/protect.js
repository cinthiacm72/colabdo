import jwt from "jsonwebtoken";
import mUser from "../models/mUser.js";

export async function protect(req, res, next) {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies.colabdoToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No estas autorizado. Por favor, registrate." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await mUser.getOneById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
