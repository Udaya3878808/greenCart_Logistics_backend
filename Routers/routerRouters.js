import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../Controllers/routerControllers.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllRoutes);
router.get("/:id", verifyToken, getRouteById);
router.post("/", verifyToken, createRoute);
router.put("/:id", verifyToken, updateRoute);
router.delete("/:id", verifyToken, deleteRoute);

export default router;
