import { prisma } from "../utils/prisma.utils.js";

class ReferralService {
    
  // Create a new referral
  async newReferral(data) {
    try {
      return await prisma.referral.create({
        data,
      });
    } catch (error) {
      console.error("Error creating referral:", error);
      throw new Error("Could not create referral.");
    }
  }

  // Fetch referrals for a specific user
  async fetchReferrals(referralUserId) {
    try {
      return await prisma.referral.findMany({
        where: {
          referralUserId,
        },
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
      console.error("Error fetching user referrals:", error);
      throw new Error("Could not fetch referrals.");
    }
  }

  async fetchWhoReferredAUser(userEmail) {
    try {
      return await prisma.referral.findUnique({
        where: {
          userEmail,
        },
      });
    } catch (error) {
      console.error("Error fetching who referred a user:", error);
      throw new Error("Could not fetch referrals.");
    }
  }
}

export default new ReferralService();
