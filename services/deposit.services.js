import { prisma } from "../utils/prisma.utils.js";

class DepositService {
    
  // Create a new deposit
  async newDeposit(data) {
    try {
      return await prisma.deposit.create({
        data,
      });
    } catch (error) {
      console.error("Error creating deposit:", error);
      throw new Error("Could not create deposit.");
    }
  }

  // Fetch deposits for a specific user
  async fetchDeposits(userId) {
    try {
      return await prisma.deposit.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user deposits:", error);
      throw new Error("Could not fetch deposits.");
    }
  }

  // Fetch a deposit
  async fetchDeposit(id) {
    try {
      return await prisma.deposit.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching deposit info:", error);
      throw new Error("Could not fetch deposit.");
    }
  }

  // Fetch all deposits
  async fetchAllDeposits() {
    try {
      return await prisma.deposit.findMany({
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
      console.error("Error fetching all deposits:", error);
      throw new Error("Could not fetch all deposits.");
    }
  }

  // Edit a deposit status
  async editDeposit(id, status) {
    try {
      return await prisma.deposit.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    } catch (error) {
      console.error("Error updating deposit status:", error);
      throw new Error("Could not update deposit status.");
    }
  }

  // Delete a deposit
  async deleteDeposit(id) {
    try {
      return await prisma.deposit.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting deposit:", error);
      throw new Error("Could not delete deposit.");
    }
  }
}

export default new DepositService();
