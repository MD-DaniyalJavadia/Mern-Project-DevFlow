import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const r = Router();
r.post("/register", register);
r.post("/login", login);
r.post("/logout", protect, logout);
r.get("/me", protect, me);
export default r;
