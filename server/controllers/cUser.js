import { createError } from "../middlewares/error.js";
import mUser from "../models/mUser.js";
import mInvitation from "../models/mInvitation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cUser = {
  login: async (req, res, next) => {
    try {
      const user = await mUser.getOne(req.body.username);

      if (!user) {
        return next(
          createError(
            401,
            "Credenciales incorrectas. Por favor, intenta nuevamente."
          )
        );
      }

      let isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return next(
          createError(
            401,
            "Credenciales incorrectas. Por favor, intenta nuevamente."
          )
        );
      }

      // Creación del token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password, ...otherDetails } = user._doc;

      res.status(200).json({
        details: { ...otherDetails },
        token: token, // ← AGREGAR esta línea
      });

      /*   res
        .cookie("colabdoToken", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        })
        .status(200)
        .json({ details: { ...otherDetails } }); */
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Eliminar la cookie
      res
        .clearCookie("colabdoToken", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({ message: "Sesión cerrada correctamente." });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { username, password, email, name, lastname, images } = req.body;

      // Llamada a create en mUser
      await mUser.create({ username, password, email, name, lastname, images });

      // Respuesta de éxito
      return res.status(201).json({
        message:
          "Usuario creado exitosamente. Redirigiendo a la pantalla de ingreso…",
      });
    } catch (err) {
      // Muestra los errores que arroja el esquema de mongoose en el email
      if (err.errors && err.errors.email) {
        return next(
          createError(
            400, // 400: Bad Request
            `Error en el campo email: ${err.errors.email.message}`
          )
        );
      }

      if (err.code === 11000) {
        return next(
          createError(
            409, // 409: Conflicto
            "El nombre de usuario o el correo electrónico ingresado ya existen. Por favor intenta nuevamente."
          )
        );
      }

      return next(createError(500, "Algo no resulto. Intenta más tarde."));
    }
  },

  user: async (req, res, next) => {
    try {
      const user = await mUser.getOne(req.params.username);

      if (!user) {
        return res.status(404).json({ message: "Recurso no encontrado." });
      }
      return res.status(200).json(user);
    } catch (err) {
      return next();
    }
  },

  search: async (req, res, next) => {
    try {
      const { query } = req.query;

      if (!query || query.length < 3) {
        return next(
          createError(
            400,
            "El término de búsqueda debe tener al menos 3 caracteres."
          )
        );
      }
      const users = await mUser.searchByQuery(query, req.user._id);

      if (users.length === 0) {
        return next(createError(404, "Usuario no encontrado."));
      }
      //Acá el formato limpio para el frontend (por ejemplo un dropdown o autocomplete)
      const result = users.map((user) => ({
        label: `${user.name} (${user.email})`,
        value: user._id,
      }));

      return res.status(200).json(result);
    } catch (err) {
      return next(err); //Segun CHAT GPT. Verificar!!! pasás el error capturado al middleware
    }
  },

  invite: async (req, res, next) => {
    try {
      const { senderId } = req.body;
      const { userId } = req.params;

      if (senderId === userId) {
        return next(
          createError(400, "No puedes enviarte una invitación a ti mismo.")
        );
      }

      // Obtener de usuario
      const user = await mUser.getOneById(userId);
      if (!user) {
        return next(createError(404, "Recurso no encontrado."));
      }

      // Verifica si ya existe una invitación enviada
      const existingInvitation = await mInvitation.validate(senderId, userId);

      if (existingInvitation !== null) {
        return res.status(200).json({
          message: `Ya has enviado una invitación a ${user.username}.`,
        });
      }

      // Envia la invitación
      await mUser.sendInvitation(senderId, userId);

      // Crea el registro de la invitación
      await mInvitation.create(senderId, userId);

      return res
        .status(200)
        .json({ message: `Invitación enviada a ${user.username}.` });
    } catch (error) {
      next();
    }
  },

  rejectInvitation: async (req, res, next) => {
    try {
      const { senderId } = req.body;
      const { userId } = req.params;

      // Obtener de usuario
      const user = await mUser.getOneById(userId);
      if (!user) {
        return next(createError(404, "Recurso no encontrado."));
      }

      // Cambia el estado de la invitación a reject y elimina el documento en la colección Invitation
      await mInvitation.reject(senderId, userId);

      // Elimina las referencias de invitación enviada y recibida de la colección User
      await mUser.deleteInvitation(senderId, userId);

      return res.status(200).json({
        message: `${user.username} ha rechazado y eliminado tu invitación.`,
      });
    } catch (err) {
      next();
    }
  },
};

export default cUser;
