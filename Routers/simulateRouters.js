import express from 'express';
import { runSimulation } from '../Controllers/simulateController.js';

const router = express.Router();

// POST /api/simulation
router.post('/', runSimulation);

export default router;
