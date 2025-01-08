//Services
import userServices from "../services/user.services.js";
import referralServices from "../services/referral.services.js";
import depositServices from "../services/deposit.services.js";
import investmentServices from "../services/investment.services.js";
import withdrawalServices from "../services/withdrawal.services.js";
import earningServices from "../services/earning.services.js";
import bonusServices from "../services/bonus.services.js";
import penaltyServices from "../services/penalty.services.js";

//Utils
import { Email } from "../utils/mail.util.js";
import { calculateUserBalance } from "../utils/calculateBalance.js";

class AdminController {
  // Render Dashboard
  async renderDashboard(req, res) {
    const users = await userServices.fetchAllUsers();
    const deposits = await depositServices.fetchAllDeposits();
    const withdrawals = await withdrawalServices.fetchAllWithdrawals();
    const investments = await investmentServices.fetchAllInvestments();
    const earnings = await earningServices.fetchAllEarnings();
    const bonuses = await bonusServices.fetchAllBonuses();
    const penalties = await penaltyServices.fetchAllPenalties();

    const allTransactions = [
      ...deposits,
      ...withdrawals,
      ...investments,
      ...earnings,
      ...bonuses,
      ...penalties,
    ];

    // Sort by `createdAt` in descending order
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    // Get the last three transactions
    const lastFiveTransactions = sortedTransactions.slice(0, 10);

    res.render("adminDashboard", {
      usersLength: users.length,
      deposits,
      withdrawals,
      investments,
      earnings,
      lastFiveTransactions,
      currentPage: req.url,
    });
  }

  // Render Deposit Page
  async renderDeposit(req, res) {
    const deposits = await depositServices.fetchAllDeposits();
    res.render("adminDeposit", {
      deposits,
      currentPage: req.url,
      depositLength: deposits.length,
    });
  }

  // Handle Deposit
  async handleDepositApproval(req, res) {
    try {
      const { id, approve, userEmail, amount } = req.body;
      const status = approve === "confirm" ? "successful" : "failed";
      await depositServices.editDeposit(id, status);
      const user = await userServices.fetchUserByEmail(userEmail);

      if (status === "successful") {
        //Check if user was referred an then add the earning to the referer
        const isUserReferred = await referralServices.fetchWhoReferredAUser(
          userEmail
        );
        if (isUserReferred) {
          const data = {
            amount: parseFloat(amount * 0.05),
            description: "Referral Reward",
            userId: isUserReferred.referralUserId,
          };
          await earningServices.newEarning(data);
        }
      }
      //Clients Notification
      status === "successful"
        ? new Email(user, amount).sendDepositFinal()
        : new Email(user, amount).sendDepositRejected();
      req.flash("message", {
        success: true,
        title: `Deposit ${status === "successful" ? "Approved" : "Rejected"}`,
        description: `The deposit made by ${user.fullName} was ${
          status === "successful" ? "approved" : "rejected"
        } successfully.`,
      });
      res.redirect("/admin/deposit");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Approval Failed",
        description: `The deposit wasn't approved successfully, please try again later.`,
      });
      res.redirect("/admin/deposit");
    }
  }

  //Render Withdrawal Page
  async renderWithdrawal(req, res) {
    const withdrawals = await withdrawalServices.fetchAllWithdrawals();
    res.render("adminWithdrawal", {
      withdrawals,
      currentPage: req.url,
      withdrawalLength: withdrawals.length,
    });
  }

  //Handle Withdrawal
  async handleWithdrawalApproval(req, res) {
    try {
      const { id, approve, userEmail, amount } = req.body;
      const status = approve === "confirm" ? "successful" : "failed";
      await withdrawalServices.editWithdrawal(id, status);
      const user = await userServices.fetchUserByEmail(userEmail);

      //Clients Notification
      status === "successful"
        ? new Email(user, amount).sendWithdrawalFinal()
        : new Email(user, amount).sendWithdrawalRejected();
      req.flash("message", {
        success: true,
        title: `Withdrawal ${
          status === "successful" ? "Approved" : "Rejected"
        }`,
        description: `The withdrawal made by ${user.fullName} was ${
          status === "successful" ? "approved" : "rejected"
        } successfully.`,
      });
      res.redirect("/admin/withdrawal");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Approval Failed",
        description: `The withdrawal wasn't approved successfully, please try again later.`,
      });
      res.redirect("/admin/withdrawal");
    }
  }

  //Render Bonus Page
  async renderBonus(req, res) {
    const bonuses = await bonusServices.fetchAllBonuses();
    res.render("adminBonus", {
      bonuses,
      currentPage: req.url,
      bonusLength: bonuses.length,
    });
  }

  // Handle Bonus
  async handleBonus(req, res) {
    const { userEmail, amount } = req.body;
    const user = await userServices.fetchUserByEmail(userEmail.toLowerCase());

    const data = {
      amount: parseFloat(amount),
      userId: user.id,
      description: req.body.description || "No description",
    };
    try {
      await bonusServices.newBonus(data);

      //Client updated
      new Email(user, amount).sendBonus();
      req.flash("message", {
        success: true,
        title: "Bonus Sent",
        description: `The bonus was sent to ${user.fullName} successfully.`,
      });
      res.redirect("/admin/bonus");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Bonus Failed",
        description: `Couldn't send bonus, kindly try again later.`,
      });
      res.redirect("/admin/bonus");
    }
  }

  //Render Penalty
  async renderPenalty(req, res) {
    const penalties = await penaltyServices.fetchAllPenalties();
    res.render("adminPenalty", {
      penalties,
      currentPage: req.url,
      penaltyLength: penalties.length,
    });
  }

  // Handle Penalty
  async handlePenalty(req, res) {
    const { userEmail, amount } = req.body;
    const user = await userServices.fetchUserByEmail(userEmail.toLowerCase());

    const data = {
      amount: parseFloat(amount),
      userId: user.id,
      description: req.body.description || "No description",
    };
    try {
      await penaltyServices.newPenalty(data);

      req.flash("message", {
        success: true,
        title: "Penalty Applied",
        description: `The penalty was applied to ${user.fullName} account successfully.`,
      });
      res.redirect("/admin/penalty");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Penalty Failed",
        description: `Couldn't apply penalty now, kindly try again later.`,
      });
      res.redirect("/admin/penalty");
    }
  }

  // Render Investment
  async renderInvestment(req, res) {
    const investments = await investmentServices.fetchAllInvestments();
    res.render("adminInvestment", {
      investments,
      currentPage: req.url,
      investmentLength: investments.length,
    });
  }

  // Render Investors
  async renderInvestors(req, res) {
    const investors = await userServices.fetchAllUsers();
    const filteredInvestors = investors.filter(
      (investor) => investor.email !== "admin@admin.com" && investor.email !== "developer@admin.com"
    );
    res.render("adminInvestors", {
      investors: filteredInvestors,
      currentPage: req.url,
      investorsLength: investors.length,
    });
  }

  //Handle Suspension
  async handleSuspension(req, res) {
    const { userId, suspend } = req.body;
    const data = { isSuspended: suspend === "suspend" };

    try {
      await userServices.editUser(userId, data);
      const user = await userServices.fetchUserById(userId);

      //Clients Notification
      suspend === "suspend"
        ? new Email(user).sendSuspended()
        : new Email(user).sendUnsuspend();

      req.flash("message", {
        success: true,
        title: "Suspension Applied",
        description: `The suspension was applied to the client's account successfully.`,
      });
      res.redirect("/admin/investors");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Suspension Failed",
        description: `Couldn't apply suspension now, kindly try again later.`,
      });
      res.redirect("/admin/investors");
    }
  }

  // Fetch a single user details
  async renderUser(req, res) {
    const { user } = req.query;
    const userDetails = await userServices.fetchUserWithDetails(user);
    const referrals = await referralServices.fetchReferrals(user);
    const balance = calculateUserBalance(userDetails);
    res.render("adminUser", {
      user: userDetails,
      currentPage: req.url,
      referrals,
      balance,
    });
  }

  //Update User's wallet
  async handleWalletUpdate(req, res) {
    const { userId, wallet } = req.body;

    try {
      await userServices.editUser(userId, { wallet });
      req.flash("message", {
        success: true,
        title: "Wallet Updated",
        description: `The client's wallet details was updated successfully.`,
      });
      res.redirect(`/admin/user?user=${userId}`);
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Wallet Not Updated",
        description: `Sorry, the client's wallet details wasn't updated, kindly try again later.`,
      });
      res.redirect(`/admin/user?user=${userId}`);
    }
  }
}

export default new AdminController();
