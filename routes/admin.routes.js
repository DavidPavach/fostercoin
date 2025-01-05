import express from "express";

//Controllers
import adminController from "../controllers/admin.controller.js";

//Middlewares
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", [ authenticate, authorize("admin") ], adminController.renderDashboard);

//Deposit
router.get("/deposit", [ authenticate, authorize("admin") ], adminController.renderDeposit);
router.patch("/deposit", [ authenticate, authorize("admin") ], adminController.handleDepositApproval);

//Withdrawal
router.get("/withdrawal", [ authenticate, authorize("admin") ], adminController.renderWithdrawal);
router.patch("/withdrawal", [ authenticate, authorize("admin") ], adminController.handleWithdrawalApproval);

// Bonus
router.get("/bonus", [ authenticate, authorize("admin") ], adminController.renderBonus);
router.post("/bonus", [ authenticate, authorize("admin") ], adminController.handleBonus);

// Penalty
router.get("/penalty", [ authenticate, authorize("admin") ], adminController.renderPenalty);
router.post("/penalty", [ authenticate, authorize("admin") ], adminController.handlePenalty);

//Investment
router.get("/investment", [ authenticate, authorize("admin") ], adminController.renderInvestment);

//Users (Clients)
router.get("/investors", [ authenticate, authorize("admin") ], adminController.renderInvestors);
router.patch("/investors", [ authenticate, authorize("admin") ], adminController.handleSuspension);
router.get("/user", [ authenticate, authorize("admin") ], adminController.renderUser);
router.post("/user", [ authenticate, authorize("admin") ], adminController.handleWalletUpdate);


export default router;
