import express from "express";
import session from "express-session";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

//Routes
import healthCheckRoute from "./routes/healthCheck.routes.js";
import authRoute from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import homeRoutes from "./routes/home.routes.js";
import notFoundRoute from "./routes/notFound.routes.js";

const app = express();

// Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Flash Middleware
app.use((req, res, next) => {
  res.locals.message = req.flash("message")[0];
  next();
});


// Routes
app.use("/", healthCheckRoute);
app.use("/", authRoute);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", homeRoutes);
app.use("*", notFoundRoute);


// Log requests for debugging
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

export default app;
