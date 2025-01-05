import app from "./app.js";
import { prisma } from "./utils/prisma.utils.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Ensure Prisma connects to MongoDB
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () =>
      console.log(`Server listening on http://127.0.0.1:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

startServer();
