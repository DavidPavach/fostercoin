import nodemailer from "nodemailer";

//Constants
const Email = process.env.EMAIL;
const EmailPassword = process.env.EMAIL_PASSWORD;
const From = process.env.FROM;
const AdminEmail = process.env.ADMIN_EMAIL;

export function sendEmail(subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: Email,
      pass: EmailPassword,
    },
  });

  const mailOptions = {
    from: From,
    to: AdminEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
