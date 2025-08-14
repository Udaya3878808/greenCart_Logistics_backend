import express from "express";
import {
  getAllDrivers,
  getAllDriversById,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../Controllers/driversControllers.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllDrivers);
router.get("/:id", verifyToken, getAllDriversById);
router.post("/", verifyToken, createDriver);
router.put("/:id", verifyToken, updateDriver);
router.delete("/:id", verifyToken, deleteDriver);

export default router;
