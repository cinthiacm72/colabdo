import { Router } from "express";
import multer from "multer";

import { protect } from "../middlewares/protect.js";
import {
  uploadUserImage,
  uploadTaskImages,
  deleteFiles,
} from "../controllers/cUpload.js";

const routes = Router();
const upload = multer();

/* // 1 imagen usuario
routes.post("/upload/user-temp", upload.single("files"), uploadUserImage); */

// 1 imagen usuario
routes.post("/upload/user", upload.array("files"), uploadUserImage);

// múltiples imágenes tarea
routes.post("/upload/task", protect, upload.array("files"), uploadTaskImages);

// borrar archivos
routes.post("/upload/delete", protect, deleteFiles);

export default routes;
