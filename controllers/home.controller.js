import { sendEmail } from "../utils/adminMail.util.js";

class HomeController {
  // Render Home page
  async renderHome(req, res) {
    res.render("home");
  }

  // Render About us
  async renderAbout(req, res) {
    res.render("about");
  }

  // Render Services
  async renderServices(req, res) {
    res.render("services");
  }

  // Render Faq
  async renderFaq(req, res) {
    res.render("faq");
  }

  // Render legal
  async renderLegal(req, res) {
    res.render("legal");
  }

  // Render Contact
  async renderContact(req, res) {
    res.render("contact");
  }

  // Handle Contact Us
  async handleContact(req, res) {
    const { email, subject, message } = req.body;

    try {

      //Admin Notification
      const subject = "New Contact Request";
      const text = `A client with the: ${email}, send a contact request with the heading: ${subject} and message: ${message}`;

      sendEmail(subject, text);
      req.flash("message", {
        success: true,
        title: "Contact Request Sent",
        description: `Your contact request was sent to one of our service agents, we will get back to you soon`,
      });
      res.redirect("/contact");
    } catch (error) {
      req.flash("message", {
        error: true,
        title: "Contact Request Failed",
        description: `Sorry, your contact request couldn't go through now, kindly try again later, thank you.`,
      });
      res.redirect("/contact");
    }
  }
}

export default new HomeController();
