// Required Libraries
import express from "express";
import session from "express-session";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import rateLimit from "express-rate-limit";

// Import Routes
import healthCheckRoute from "./routes/healthCheck.routes.js";
import authRoute from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import homeRoutes from "./routes/home.routes.js";
import notFoundRoute from "./routes/notFound.routes.js";

const app = express();

app.set("trust proxy", 3);

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

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Flash Middleware
app.use((req, res, next) => {
  res.locals.message = req.flash("message")[0];
  next();
});


app.get("/proxy-info", (req, res) => {
  res.json({
    clientIp: req.ip,
    forwardedFor: req.headers["x-forwarded-for"] || "Not provided",
    protocol: req.protocol,
    proxyCount: (req.headers["x-forwarded-for"] || "").split(",").length - 1,
  });
});

// Routes
app.use("/", healthCheckRoute);
app.use("/", authRoute);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", homeRoutes);
app.use("*", notFoundRoute);

// Enhanced Logging
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url} from IP: ${req.ip}`);
  next();
});

export default app;