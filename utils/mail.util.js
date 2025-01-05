import nodemailer from "nodemailer";
import ejs from "ejs";
import { convert } from "html-to-text";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Constants
const email = process.env.EMAIL;
const EmailPassword = process.env.EMAIL_PASSWORD;
const From = process.env.FROM;

export class Email {
  constructor(user, amount, code) {
    this.to = user.email;
    this.name = user.fullName;
    this.amount = amount;
    this.code = code;
  }

  async _createTransporter() {
    return nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: EmailPassword,
      },
    });
  }

  async _send(template, subject) {
    function getCurrentYear() {
      const currentDate = new Date();
      return currentDate.getFullYear();
    }

    const html = await ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`,
      {
        name: this.name,
        amount: this.amount,
        code: this.code,
        year: getCurrentYear(),
      },
    );

    const mailOptions = {
      from: From, 
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    };

    const transporter = await this._createTransporter();
    transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this._send("welcome", "Welcome to Foster Coin");
  }
  async sendDeposit() {
    await this._send("deposit", "New Deposit");
  }
  async sendDepositFinal() {
    await this._send("depositFinal", "Deposit Confirmed");
  }
  async sendInvestment() {
    await this._send("investment", "New Investment");
  }
  async sendWithdrawal() {
    await this._send("withdrawal", "New Withdrawal");
  }
  async sendWithdrawalFinal() {
    await this._send("withdrawFinal", "Withdrawal Confirmed");
  }
  async sendForgotPassword() {
    await this._send("forgotPassword", "Forgot Password");
  }
  async sendBonus() {
    await this._send("bonus", "New Bonus");
  }
  async sendSuspended() {
    await this._send("suspended", "Account Suspended");
  }
  async sendUnsuspend() {
    await this._send("unSuspend", "Account Reinstatement");
  }
  async sendDepositRejected() {
    await this._send("depositRejected", "Deposit Rejected");
  }
  async sendWithdrawalRejected() {
    await this._send("withdrawalRejected", "Withdrawal Rejected");
  }
  async sendPayout() {
    await this._send("payout", "New Earning");
  }
}