import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Throw an error that something went wrong
    console.error("No token found");
    req.flash("message", {
      error: true,
      title: "Access Denied",
      description: "You must be logged in to access this page.",
    });
    res.redirect("/login");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.locals.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.redirect("/login");
  }
};
