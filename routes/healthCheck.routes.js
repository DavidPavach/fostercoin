import express from "express";

//Controllers
import userController from "../controllers/user.controller.js";

const router = express.Router();

// Health Check Route
router.get("/health", userController.healthCheck);

export default router;