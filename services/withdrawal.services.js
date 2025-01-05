import { prisma } from "../utils/prisma.utils.js";

class WithdrawalService {
    
  // Create a new withdrawal
  async newWithdrawal(data) {
    try {
      return await prisma.withdrawal.create({
        data,
      });
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      throw new Error("Could not create withdrawal.");
    }
  }

  // Fetch withdrawal for a specific user
  async fetchWithdrawals(userId) {
    try {
      return await prisma.withdrawal.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching user withdrawals:", error);
      throw new Error("Could not fetch withdrawals.");
    }
  }

  // Fetch a withdrawal
  async fetchWithdrawal(id) {
    try {
      return await prisma.withdrawal.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching a withdrawal:", error);
      throw new Error("Could not fetch withdrawal.");
    }
  }

  // Fetch all withdrawals
  async fetchAllWithdrawals() {
    try {
      return await prisma.withdrawal.findMany({
        
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
      console.error("Error fetching all withdrawals:", error);
      throw new Error("Could not fetch all withdrawals.");
    }
  }

  // Edit a withdrawal status
  async editWithdrawal(id, status) {
    try {
      return await prisma.withdrawal.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      throw new Error("Could not update withdrawal status.");
    }
  }

  // Delete a withdrawal
  async deleteWithdrawal(id) {
    try {
      return await prisma.withdrawal.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting withdrawal:", error);
      throw new Error("Could not delete withdrawal.");
    }
  }
}

export default new WithdrawalService();