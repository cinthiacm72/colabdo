import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routesUsers from "./routes/rUser.js";
import routesTasks from "./routes/rTask.js";
import routesUploads from "./routes/rUpload.js";
import routesNotifications from "./routes/rNotification.js";
import { createError } from "./middlewares/error.js";
import { errorHandler } from "./middlewares/error.js";
import http from "http";
import { Server as IOServer } from "socket.io";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import mTask from "./models/mTask.js";
import mNotification from "./models/mNotification.js";

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204, // ✅ Agregar esto
  })
);

const io = new IOServer(server, {
  cors: { origin: clientUrl, credentials: true },
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
app.use(routesNotifications);

// middleware sockets: leer token y unir sala por userId
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
  } catch (err) {}
  next();
});

io.on("connection", (socket) => {
  if (socket.userId) socket.join(String(socket.userId));
  console.log(
    "Socket.IO: cliente conectado",
    socket.id,
    "userId=",
    socket.userId
  ); // <-- añadido para debug
  socket.on("disconnect", () => {});
});

// Exponer io a controladores
app.set("io", io);

// Cron: ejecutar cada día a las 08:00 (ajustar según necesidad)
// Busca tareas con dueDate hoy y notifica a owner + sharedWith
cron.schedule("0 8 * * *", async () => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tasks = await mTask.getDueBetween(start, end); // implementar en mTask (ver abajo)
    for (const task of tasks) {
      const recipients = [
        String(task.user._id),
        ...(task.sharedWith || []).map((s) => String(s._id)),
      ];
      for (const u of recipients) {
        await mNotification.create({
          user: u,
          title: "Tarea vence hoy",
          body: task.title,
          meta: { taskId: task._id },
        });
        io.to(u).emit("notification", {
          title: "Tarea vence hoy",
          body: task.title,
          taskId: task._id,
        });
      }
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});

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

server.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
