import cron from "node-cron";

// Services
import { CronJobService } from "../services/cronService.services.js";
import userServices from "../services/user.services.js";
import referralServices from "../services/referral.services.js";
import depositServices from "../services/deposit.services.js";
import investmentServices from "../services/investment.services.js";
import withdrawalServices from "../services/withdrawal.services.js";
import earningServices from "../services/earning.services.js";
import bonusServices from "../services/bonus.services.js";
import penaltyServices from "../services/penalty.services.js";
import userProfileServices from "../services/userProfile.services.js";

//Utils
import { Email } from "../utils/mail.util.js";
import { sendEmail } from "../utils/adminMail.util.js";
import { calculateUserBalance } from "../utils/calculateBalance.js";

class UserController {
  //Cron Job Initialization
  constructor() {
    const cronJobService = new CronJobService();

    // Schedule the cron job to run every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
      await cronJobService.runDailyInvestmentUpdates();
    });
  }

  //Health Check Route
  async healthCheck(req, res) {
    console.log("Health check was done successfully.");
    return res
      .status(200)
      .json({ message: "Health Check was completed successfully." });
  }

  //Render User Dashboard
  async renderDashboard(req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserWithDetails(userId);
    const referrals = await referralServices.fetchReferrals(userId);
    const allTransactions = [
      ...userDetails.Deposits,
      ...userDetails.Withdrawals,
      ...userDetails.Investments,
      ...userDetails.Penalties,
      ...userDetails.Earnings,
    ];

    const userBalance = calculateUserBalance(userDetails);

    // Sort by `createdAt` in descending order
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Get the last three transactions
    const lastThreeTransactions = sortedTransactions.slice(0, 3);

    return res.render(userDetails.isSuspended ? "suspend" : "dashboard", {
      user: userDetails,
      referrals,
      currentPage: req.url,
      lastThreeTransactions,
      userBalance,
    });
  }

  //Render user deposit
  async renderDepositPage(req, res) {
    const userDetails = res.locals.userDetails;
    const userBalance = calculateUserBalance(userDetails);
    return res.render(userDetails.isSuspended ? "suspend" : "deposit", {
      user: userDetails,
      currentPage: req.url,
      deposits: userDetails.Deposits,
      userBalance,
    });
  }

  // Process Deposits
  async handleDeposit(req, res) {
    try {
      if (req.body.amount < 100) {
        req.flash("message", {
          info: true,
          title: "Insufficient Amount",
          description: `Sorry, the minimum amount to deposit is $100 kindly add $${
            100 - req.body.amount
          } to the previous amount.`,
        });
        return res.redirect("/user/deposit");
      }
      const userId = res.locals.user.id;
      const userDetails = await userServices.fetchUserById(userId);
      res.render("checkout", {
        amount: req.body.amount,
        currentPage: "/deposit",
        user: userDetails,
      });
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Error",
        description:
          "Sorry, we couldn't process your deposit request now, kindly try again later.",
      });
    }
  }

  //Process Checkout
  async handleCheckout(req, res) {
    try {
      if (req.body.action === "cancel") {
        return res.redirect("/user/deposit");
      }

      const userId = res.locals.user.id;
      const userDetails = await userServices.fetchUserById(userId);

      const data = {
        amount: parseFloat(req.body.amount),
        transactionHash: req.body.transactionHash,
        userId: userId,
      };

      await depositServices.newDeposit(data);

      // Client Notification
      new Email(userDetails, data.amount).sendDeposit();

      //Admin Notification
      const subject = "New Deposit Notification";
      const text = `The client ${userDetails.fullName} and email ${userDetails.email} just deposited $${data.amount} in your website, kindly log in to confirm.`;

      sendEmail(subject, text);

      req.flash("message", {
        success: true,
        title: "Deposit Successful",
        description: `Your deposit of ${data.amount} was successful and currently pending. You can view the status in your history or deposit page.`,
      });
      res.redirect("/user/deposit");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Deposit Failed",
        description: `We were unable to process your deposit at this time. Please try again later.`,
      });
      res.redirect("/user/deposit");
    }
  }

  // Render Plans Page
  async renderPlansPage(req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);
    return res.render(userDetails.isSuspended ? "suspend" : "plans", {
      user: userDetails,
      currentPage: req.url,
    });
  }

  // Render Investment Page
  async renderInvestmentPage(req, res) {
    const userBalance = res.locals.userBalance;
    const userDetails = res.locals.userDetails;
    const investments = userDetails.Investments.filter(
      (investment) => investment.status === "running"
    );

    return res.render(userDetails.isSuspended ? "suspend" : "investment", {
      user: userDetails,
      currentPage: req.url,
      investments,
      totalInvestments: userDetails.Investments.length,
      userBalance,
    });
  }

  // Handle Investment
  async handleInvestment(req, res) {
    const userDetails = res.locals.userDetails;
    const { investmentPlan, amount } = req.body;

    const plans = {
      starter: { min: 100, max: 999, dailyPercent: 1.5 },
      premium: { min: 1000, max: 4999, dailyPercent: 2 },
      golden: { min: 5000, max: 10000, dailyPercent: 2.5 },
      vip: { min: 10001, max: Infinity, dailyPercent: 5 },
    };

    const currentDate = new Date();
    const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
      // Ensure the selected plan exists
      if (!plans[investmentPlan]) {
        req.flash("message", {
          error: true,
          title: "Investment Failed",
          description: `Invalid investment plan selected.`,
        });
        return res.redirect("/user/invest");
      }

      // Validate amount against the selected plan
      const { min, max } = plans[investmentPlan];
      if (amount < min || amount > max) {
        req.flash("message", {
          error: true,
          title: "Investment Failed",
          description: `The amount must be between $${min} and $${max} for the ${
            investmentPlan.charAt(0).toUpperCase() + investmentPlan.slice(1)
          } Plan.`,
        });
        return res.redirect("/user/invest"); // Redirect to the form
      }

      //Make sure the user has such amount
      const userBalance = res.locals.userBalance;
      if (amount > userBalance) {
        req.flash("message", {
          error: true,
          title: "Investment Failed",
          description: `You need to deposit $${
            amount - userBalance
          } in order to invest in the ${
            investmentPlan.charAt(0).toUpperCase() + investmentPlan.slice(1)
          } Plan.`,
        });
        return res.redirect("/user/deposit");
      }

      const data = {
        plan: investmentPlan,
        amount: parseFloat(amount),
        dailyPercent: plans[investmentPlan].dailyPercent,
        endDate,
        payoutAmount: parseFloat(amount),
        userId: userId,
      };

      await investmentServices.newInvestment(data);

      //Client Notification
      new Email(userDetails, data.amount, data.plan).sendInvestment();

      //Admin Notification
      const subject = "New Investment Notification";
      const text = `The client of name: ${userDetails.fullName} and email: ${userDetails.email} just started the ${data.plan}  plan with the amount $${data.amount} in your website.`;

      sendEmail(subject, text);

      req.flash("message", {
        success: true,
        title: "Investment Successful",
        description: `Your investment has been successfully placed. You can view your investment details in your portfolio`,
      });
      res.redirect("/user/invest");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Investment Failed",
        description: `We were unable to process your investment at this time. Please review the details and try again.`,
      });
      res.redirect("/user/invest");
    }
  }

  // Render User Withdrawal
  async renderWithdrawal(req, res) {
    const userBalance = res.locals.userBalance;
    const userDetails = res.locals.userDetails;
    return res.render(userDetails.isSuspended ? "suspend" : "withdraw", {
      user: userDetails,
      currentPage: req.url,
      withdrawals: userDetails.Withdrawals,
      userBalance,
    });
  }

  //Process Withdrawal
  async handleWithdrawal(req, res) {
    const userBalance = res.locals.userBalance;
    const userDetails = res.locals.userDetails;

    const { amount } = req.body;

    try {
      if (req.body.amount < 10) {
        req.flash("message", {
          info: true,
          title: "Insufficient Amount",
          description: `Sorry, the minimum amount to withdraw is $100 kindly add $${
            100 - req.body.amount
          } to the previous amount.`,
        });
        return res.redirect("/user/withdraw");
      }

      //Check if the user entered a bigger amount
      if (amount > userBalance) {
        req.flash("message", {
          error: true,
          title: "Withdrawal Failed",
          description: `We were unable to process your withdrawal request at this time. Please review the requested amount and try again later.`,
        });
        return res.redirect("/user/withdraw");
      }

      //Check if the user has a wallet address
      if (userDetails.wallet === "No wallet address") {
        req.flash("message", {
          error: true,
          title: "Withdrawal Failed",
          description: `We were unable to process your withdrawal request at this time. Please update your Bitcoin wallet address.`,
        });
        return res.redirect("/user/profile");
      }

      const data = {
        amount: parseFloat(amount),
        walletAddress: userDetails.wallet,
        userId,
      };

      await withdrawalServices.newWithdrawal(data);

      //Client Notification
      new Email(userDetails, data.amount).sendWithdrawal();

      //Admin Notification
      const subject = "New Withdrawal Notification";
      const text = `The client of name: ${userDetails.name} and email ${userDetails.email} just withdrew amount: $${data.amount} from his account now, kindly log in to confirm the withdrawal.`;

      sendEmail(subject, text);

      req.flash("message", {
        success: true,
        title: "Withdrawal Successful",
        description: `Your withdrawal request has been submitted successfully. Please, processing time takes between an hour to 24 Hours.`,
      });
      res.redirect("/user/withdraw");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Withdrawal Failed",
        description: `We were unable to process your withdrawal request at this time. Please review the details and try again later.`,
      });
      res.redirect("/user/withdraw");
    }
  }

  // Render History
  async renderHistory(req, res) {
    const userBalance = res.locals.userBalance;
    const userDetails = res.locals.userDetails;
    const allTransactions = [
      ...userDetails.Deposits,
      ...userDetails.Withdrawals,
      ...userDetails.Investments,
      ...userDetails.Penalties,
      ...userDetails.Earnings,
      ...userDetails.Bonuses,
    ];

    // Sort by `createdAt` in descending order
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.render(userDetails.isSuspended ? "suspend" : "history", {
      user: userDetails,
      currentPage: req.url,
      withdrawals: userDetails.Withdrawals,
      userBalance,
      transactions: sortedTransactions,
    });
  }

  async renderIndividualHistory(req, res) {
    const { id, type } = req.query;
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);
    if (!id || !type) {
      req.flash("message", {
        error: true,
        title: "Error",
        description: `Sorry, we couldn't fetch more details about the transaction, please try again later.`,
      });
      return res.redirect("/user/history");
    }

    // Fetch the transaction based on its type and ID
    let transaction;
    switch (type.toLowerCase()) {
      case "deposit":
        transaction = await depositServices.fetchDeposit(id);
        break;
      case "withdrawal":
        transaction = await withdrawalServices.fetchWithdrawal(id);
        break;
      case "investment":
        transaction = await investmentServices.fetchInvestment(id);
        break;
      case "penalty":
        transaction = await penaltyServices.fetchPenalty(id);
        break;
      case "earning":
        transaction = await earningServices.fetchEarning(id);
        break;
      case "bonus":
        transaction = await bonusServices.fetchBonus(id);
        break;
      default:
        req.flash("error", "Invalid transaction type.");
        return res.redirect("/user/history");
    }

    if (!transaction) {
      req.flash("error", "Transaction not found.");
      return res.redirect("/user/history");
    }

    // Render transaction details
    res.render(userDetails.isSuspended ? "suspend" : "transaction", {
      transaction,
      type,
      user: userDetails,
      currentPage: req.url,
    });
  }

  // Render Referral
  async renderReferral(req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);
    const referrals = await referralServices.fetchReferrals(userId);

    res.render(userDetails.isSuspended ? "suspend" : "referral", {
      referrals,
      user: userDetails,
      currentPage: req.url,
    });
  }

  // Render Profile
  async renderProfile(req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);
    let userProfile;
    userProfile = await userProfileServices.fetchUserProfile(userId);

    //Check if the user has a profile, if not create a new one
    if (!userProfile) {
      await userProfileServices.newUserProfile({ userId });
    }
    res.render(userDetails.isSuspended ? "suspend" : "profile", {
      user: userDetails,
      currentPage: req.url,
      userProfile,
    });
  }

  // Handle Profile Edit
  async handleProfileEdit(req, res) {
    const userId = res.locals.user.id;
    const data = {
      country: req.body.country || null,
      city: req.body.city || null,
      postalCode: req.body.postalCode || null,
      gender: req.body.gender || null,
    };

    try {
      // Update the user's profile
      await userProfileServices.editUserProfile(userId, data);

      req.flash("message", {
        success: true,
        title: "Profile Updated",
        description: `Your profile was updated successfully.`,
      });
      res.redirect("/user/profile");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Profile Not Updated",
        description: `Sorry, we couldn't update your profile, kindly try again later.`,
      });
      res.redirect("/user/profile");
    }
  }

  // Render Support Page
  async renderSupportPage (req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);

    res.render(userDetails.isSuspended ? "suspend" : "support", {
      user: userDetails,
      currentPage: req.url,
    });
  }

  //Handle Support
  async handleSupport (req, res) {
    const userId = res.locals.user.id;
    const userDetails = await userServices.fetchUserById(userId);

    const { heading, body } = req.body

    try {

      //Admin Notification
      const subject = "New Support Request";
      const text = `The client of name: ${userDetails.name} and email ${userDetails.email} just requested for support. The title of his complaint ${heading} and the complaint or enquiry is ${body}.`;

      sendEmail(subject, text);

      req.flash("message", {
        success: true,
        title: "Support Ticket Received",
        description: `We're glad we could assist you. Your support ticket has been received.`,
      });
      res.redirect("/user/support");
    } catch (error) {
      
      req.flash("message", {
        error: true,
        title: "Error",
        description: `Unable to process support request. Please try again later.`,
      });
      res.redirect("/user/support");
    }
  }
  
}

export default new UserController();
