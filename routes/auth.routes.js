import express from "express";

//Controllers
import authController from "../controllers/auth.controller.js";

const router = express.Router();

// Registration Page
router.get("/create", authController.renderRegistration);
router.post("/create", authController.registration);

//Login Page
router.get("/login", authController.renderLoginPage);
router.post("/login", authController.loginUser);

//Forgot Password Page
router.get("/forgot", authController.renderForgotPassword);
router.post("/forgot", authController.handleForgotPassword);

//Logout
router.post("/logout", authController.logoutUser);

export default router;