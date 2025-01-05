import express from "express";

//Controllers
import userController from "../controllers/user.controller.js";

//Middlewares
import { authenticate } from "../middlewares/authenticate.js";
import { fetchDetails } from "../middlewares/fetchDetails.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", authenticate, userController.renderDashboard);

//Deposit and Checkout
router.get("/deposit", [ authenticate, fetchDetails ], userController.renderDepositPage);
router.post("/deposit", authenticate, userController.handleDeposit);
router.post("/checkout", authenticate, userController.handleCheckout);

//Plan Page
router.get("/plans", authenticate, userController.renderPlansPage);

//Investment
router.get("/invest", [ authenticate, fetchDetails ], userController.renderInvestmentPage);
router.post("/invest", [ authenticate, fetchDetails ], userController.handleInvestment);

//Withdrawal
router.get("/withdraw", [ authenticate, fetchDetails ], userController.renderWithdrawal);
router.post("/withdraw", [ authenticate, fetchDetails ], userController.handleWithdrawal);

//History
router.get("/history", [ authenticate, fetchDetails ], userController.renderHistory);

//Individual History
router.get("/transaction", authenticate, userController.renderIndividualHistory);

//Referral
router.get("/referral", authenticate, userController.renderReferral);

//Profile
router.get("/profile", authenticate, userController.renderProfile);
router.post("/profile", authenticate, userController.handleProfileEdit);

// Support
router.get("/support", authenticate, userController.renderSupportPage);
router.post("/support", authenticate, userController.handleSupport);


export default router;