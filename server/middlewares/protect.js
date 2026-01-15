import jwt from "jsonwebtoken";
import mUser from "../models/mUser.js";
import mRevokedToken from "../models/mRevokedToken.js";

export async function protect(req, res, next) {
  try {
    // Obtener token desde Authorization Bearer
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res
        .status(401)
        .json({ message: "No estas autorizado. Por favor, registrate." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Configuración del servidor incompleta (JWT_SECRET).",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    // Verificar revocación
    const isRevoked = await mRevokedToken.exists(token);
    if (isRevoked) {
      return res
        .status(401)
        .json({ message: "Token revocado. Inicia sesión de nuevo." });
    }

    const user = await mUser.getOneById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const { password, ...safeUser } = user._doc || user;
    req.user = safeUser;
    next();
  } catch (err) {
    next(err);
  }
}
