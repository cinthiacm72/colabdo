import { Router } from "express";
import cUser from "../controllers/cUser.js";
import { protect } from "../middlewares/protect.js";

const routes = Router();
routes.post("/login", cUser.login);
routes.post("/logout", cUser.logout);
routes.post("/register", cUser.register);

routes.get("/user/:username", protect, cUser.user);

routes.get("/users", protect, cUser.search);
routes.post("/users/:userId/invite", protect, cUser.invite);
routes.post("/users/:userId/invite/reject", protect, cUser.rejectInvitation);

export default routes;
