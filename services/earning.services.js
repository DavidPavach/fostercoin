import { prisma } from "../utils/prisma.utils.js";

class EarningService {
    
  // Create a new earning
  async newEarning(data) {
    try {
      return await prisma.earning.create({
        data,
      });
    } catch (error) {
      console.error("Error creating earning:", error);
      throw new Error("Could not create earning.");
    }
  }

  // Fetch earnings for a specific user
  async fetchEarnings(userId) {
    try {
      return await prisma.earning.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user earnings:", error);
      throw new Error("Could not fetch earnings.");
    }
  }

  // Fetch specific earning
  async fetchEarning(id) {
    try {
      return await prisma.earning.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching an earning:", error);
      throw new Error("Could not fetch earning.");
    }
  }

  // Fetch all earnings
  async fetchAllEarnings() {
    try {
      return await prisma.earning.findMany({
        include: {
          User: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      throw new Error("Could not fetch earnings.");
    }
  }
}

export default new EarningService
