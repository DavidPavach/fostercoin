import { prisma } from "../utils/prisma.utils.js";

class PenaltyService {
    
  // Create a new penalty
  async newPenalty(data) {
    try {
      return await prisma.penalty.create({
        data,
      });
    } catch (error) {
      console.error("Error creating penalty:", error);
      throw new Error("Could not create penalty.");
    }
  }

  // Fetch penalties for a specific user
  async fetchPenalties(userId) {
    try {
      return await prisma.penalty.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user penalties:", error);
      throw new Error("Could not fetch penalties.");
    }
  }

  // Fetch specific penalty
  async fetchPenalty(id) {
    try {
      return await prisma.penalty.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching the penalty:", error);
      throw new Error("Could not fetch penalty.");
    }
  }

  // Fetch all penalties
  async fetchAllPenalties() {
    try {
      return await prisma.penalty.findMany({
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
      console.error("Error fetching all penalties:", error);
      throw new Error("Could not fetch all penalties.");
    }
  }

  // Delete a penalty
  async deletePenalty(id) {
    try {
      return await prisma.penalty.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting penalty:", error);
      throw new Error("Could not delete penalty.");
    }
  }
}

export default new PenaltyService()