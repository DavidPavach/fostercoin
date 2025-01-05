import express from "express";

const router = express.Router();

//Controllers
import homeController from "../controllers/home.controller.js";

//Index Page
router.get("/",  homeController.renderHome);

//About Us
router.get("/about", homeController.renderAbout);

//Services
router.get("/services", homeController.renderServices);

//Contact
router.get("/contact", homeController.renderContact);
router.post("/contact", homeController.handleContact);

//FAQ
router.get("/faq", homeController.renderFaq);

//About Legal
router.get("/legal", homeController.renderLegal);



export default router;