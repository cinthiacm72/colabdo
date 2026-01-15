import { Router } from "express";
import multer from "multer";

import { protect } from "../middlewares/protect.js";
import {
  uploadUserImage,
  uploadTaskImages,
  deleteFiles,
} from "../controllers/cUpload.js";

const routes = Router();

// Tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error(
          "Formato no permitido. Solo imágenes (JPG, PNG, WEBP) o PDF."
        ),
        false
      );
    }
    cb(null, true);
  },
});

/* // 1 imagen usuario
routes.post("/upload/user-temp", upload.single("files"), uploadUserImage); */

// 1 imagen usuario
routes.post("/upload/user", upload.array("files"), uploadUserImage);

// múltiples imágenes tarea
routes.post("/upload/task", protect, upload.array("files"), uploadTaskImages);

// borrar archivos
routes.delete("/upload/delete", protect, deleteFiles);

export default routes;
