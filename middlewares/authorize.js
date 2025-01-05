export const authorize = (role) => {
  return function (req, res, next) {
    if (!res.locals.user || res.locals.user.role !== role) {
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

    next();
  };
};
