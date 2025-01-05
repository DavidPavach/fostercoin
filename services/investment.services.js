import { prisma } from "../utils/prisma.utils.js";

class InvestmentService {
    
  // Create a new investment
  async newInvestment(data) {
    try {
      return await prisma.investment.create({
        data,
      });
    } catch (error) {
      console.error("Error creating investment:", error);
      throw new Error("Could not create investment.");
    }
  }

  // Fetch investment for a specific user
  async fetchInvestments(userId) {
    try {
      return await prisma.investment.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user investment:", error);
      throw new Error("Could not fetch investment.");
    }
  }

  // Fetch a specific investment
  async fetchInvestment(id) {
    try {
      return await prisma.investment.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching the investment:", error);
      throw new Error("Could not fetch investment.");
    }
  }

  // Fetch all investment
  async fetchAllInvestments() {
    try {
      return await prisma.investment.findMany({
        
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
      console.error("Error fetching all investment:", error);
      throw new Error("Could not fetch all investment.");
    }
  }

  // Delete an investment
  async deleteDeposit(id) {
    try {
      return await prisma.investment.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting investment:", error);
      throw new Error("Could not delete investment.");
    }
  }
}


export default new InvestmentService();