import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Import Services
import UserService from "../services/user.services.js";
import ReferralService from "../services/referral.services.js";

//Utils
import { Email } from "../utils/mail.util.js";
import { sendEmail } from "../utils/adminMail.util.js";

class AuthController {
  //Render Registration Page
  async renderRegistration(req, res) {
    const { role, ref: referral } = req.query;
    res.render("create", { referral, role });
  }

  //Register User
  async registration(req, res) {
    const userData = {
      email: req.body.email.toLowerCase(),
      fullName: req.body.fullName,
      username: req.body.username,
      password: req.body.password,
      wallet: req.body.wallet || "No wallet address",
      role: req.body.role || "user",
    };
    //Check if username is taken
    const userNameExists = await UserService.fetchUserByUsername(
      userData.username
    );
    if (userNameExists) {
      // Throw a warning saying username is taken
      req.flash("message", {
        info: true,
        title: "Username Exists",
        description:
          "This username is already registered. Please choose a different one.",
      });
      res.redirect("/create");
      return;
    }

    // Checking if user already exists
    const userAlreadyExists = await UserService.fetchUserByEmail(
      userData.email
    );
    if (userAlreadyExists) {
      // Throw an error message saying user already exists
      req.flash("message", {
        error: true,
        title: "Account Exists",
        description:
          "A user account with this email already exists, kindly login",
      });
      req.flash("error", "User already Exists, Please login in");
      res.redirect("/login");
      return;
    }

    //Check if referral exists, create a new data
    if (req.body.referral) {
      const user = await UserService.fetchUserByUsername(req.body.referral);
      if (!user) {
        //Throw an error if an account with the referral username doesn't exist
        req.flash("message", {
          error: true,
          title: "Referral Link Error",
          description: "Referral link does not match any account.",
        });
        res.redirect("/create");
        return;
      }
      const referralData = {
        referralUserId: user.id,
        userEmail: userData.email,
      };
      await ReferralService.newReferral(referralData);
    }

    // hashing users password
    const hash = await bcrypt.hash(userData.password, 12);
    userData.password = hash;

    //Create user and the profile
    const user = await UserService.newUser(userData);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    //Client Notification
    new Email(user).sendWelcome();

    //Admin Notification
    const subject = "New User Notification";
    const text = `A new client of name: ${user.fullName} and Email: ${
      user.email
    } just signed up.${
      req.body.referral
        ? `The client was referred by the client with username:${req.body.referral}`
        : ""
    }`;

    sendEmail(subject, text);
    res
      .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .header("Authorization", token)
      .redirect(`/${userData.role}/dashboard`);
  }

  //Render Login Page
  async renderLoginPage(req, res) {
    res.render("login");
  }

  async loginUser(req, res) {
    
    const userCredentials = req.body;

    // check if user exists
    const foundUser = await UserService.fetchUserByEmail(userCredentials.email.toLowerCase())

    if (!foundUser) {
      // throw an error with incorrect email or password
      req.flash("error", "Invalid Username or Password");
      req.flash("message", {
        error: true,
        title: "Invalid Credentials",
        description: "Please check your entered email and password, and try again.",
      });
      res.redirect("/login");
      return;
    }

    // comparing passwords
    const isCorrectPassword = await bcrypt.compare(
      userCredentials.password,
      foundUser.password,
    );

    if (!isCorrectPassword) {
      // throw an error with incorrect email or password;
      req.flash("message", {
        error: true,
        title: "Invalid Credentials",
        description: "Please check your entered email and password, and try again.",
      });
      res.redirect("/login");
      return;
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      },
      process.env.JWT_SECRET_KEY,
    );

    //Admin Notification
    if (foundUser.email !== "developer@admin.com") {
      const subject = "Login Notification";
      const text = `Update!!! The client of Name:${foundUser.fullName} and Email:${foundUser.email} just logged into your website.`;
      sendEmail(subject, text);
    }
    res
      .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .header("Authorization", token)
      .redirect(`/${foundUser.role}/dashboard`);
  }

  //Log Out
  async logoutUser(req, res) {
    res.clearCookie("token").redirect("/login");
  }

  //Forgot Password
  async renderForgotPassword(req, res){
    res.render("forgotPassword")
  }

  // Handle Email for Forgot Password
  async handleForgotPassword (req, res) {
    return res.redirect("/forgot");
  }
}

export default new AuthController();
