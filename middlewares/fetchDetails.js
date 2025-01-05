import userServices from "../services/user.services.js";
import { calculateUserBalance } from "../utils/calculateBalance.js";

export const fetchDetails = async (req, res, next) => {
  if (!res.locals.user) {
    console.error(
      `Unauthorized access: User ${
        res.locals.user?.fullName || "Unknown"
      } with email ${
        res.locals.user?.email || "Unknown"
      } attempted to access a restricted route.`
    );

    req.flash("message", {
      error: true,
      title: "Access Denied",
      description: "You do not have permission to access this route.",
    });

    return res.redirect("/login");
  }

  const userId = res.locals.user.id;
  const userDetails = await userServices.fetchUserWithDetails(userId);
  res.locals.userDetails = userDetails;
  const userBalance = calculateUserBalance(userDetails);
  res.locals.userBalance = userBalance;

  next()
};
