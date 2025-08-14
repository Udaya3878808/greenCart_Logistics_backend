import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../Controllers/authControllers.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout",verifyToken ,logout);
router.get("/profile", verifyToken, getProfile);

export default router;