import { Router } from "express";
import cTask from "../controllers/cTask.js";
import { protect } from "../middlewares/protect.js";

const routes = Router();
routes.post("/task/new", protect, cTask.new);
routes.get("/tasks", protect, cTask.all);
routes.delete("/task/delete/:taskId", protect, cTask.deletion);
routes.put("/task/update/:taskIdToUpdate", protect, cTask.update);
routes.get("/tasks/count/priority", protect, cTask.priorityCount);
routes.get("/tasks/count/overdue", protect, cTask.overdueCount);
routes.get("/tasks/count/today", protect, cTask.todayCount);

export default routes;
