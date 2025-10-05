import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routesUsers from "./routes/rUser.js";
import routesTasks from "./routes/rTask.js";
import routesUploads from "./routes/rUpload.js";
import { createError } from "./middlewares/error.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();

const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

//app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Mundo!");
});

//Rutas
app.use(routesUsers);
app.use(routesTasks);
app.use(routesUploads);

// Manejador de rutas no encontradas
app.use((req, res, next) => {
  next(createError(404, "La ruta solicitada no existe."));
});

// Middleware de manejo de Errores
const isDev = process.env.NODE_ENV === "development";

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Error interno de servidor";
  const errorDetails = err.details || [];
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    details: errorDetails,
    ...(isDev && { stack: err.stack }),
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
