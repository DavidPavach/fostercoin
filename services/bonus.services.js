import { prisma } from "../utils/prisma.utils.js";

class BonusService {
    
  // Create a new bonus
  async newBonus(data) {
    try {
      return await prisma.bonus.create({
        data,
      });
    } catch (error) {
      console.error("Error creating bonus:", error);
      throw new Error("Could not create bonus.");
    }
  }

  // Fetch bonuses for a specific user
  async fetchBonuses(userId) {
    try {
      return await prisma.bonus.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user bonuses:", error);
      throw new Error("Could not fetch bonuses.");
    }
  }

  // Fetch a specific bonus
  async fetchBonus(id) {
    try {
      return await prisma.bonus.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching a bonus:", error);
      throw new Error("Could not fetch bonus.");
    }
  }


  // Fetch all bonuses
  async fetchAllBonuses() {
    try {
      return await prisma.bonus.findMany({
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
      console.error("Error fetching all bonuses:", error);
      throw new Error("Could not fetch all bonuses.");
    }
  }

  // Delete a bonus
  async deleteBonus(id) {
    try {
      return await prisma.bonus.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting bonus:", error);
      throw new Error("Could not delete bonus.");
    }
  }
}

export default new BonusService()