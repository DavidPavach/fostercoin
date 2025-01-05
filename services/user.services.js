import { prisma } from "../utils/prisma.utils.js";

class UserService {
  // Create a new user
  async newUser(data) {
    try {
      return await prisma.user.create({
        data,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Could not create user.");
    }
  }

  // Edit user profile for a specific user
  async editUser(id, data) {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data
      });
    } catch (error) {
      console.error("Error editing user data:", error);
      throw new Error("Could not edit user data.");
    }
  }

  // Fetch a user using id
  async fetchUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error fetching a user using id:", error);
      throw new Error("Could not fetch user details.");
    }
  }

  // Fetch a user using username
  async fetchUserByUsername(username) {
    try {
      return await prisma.user.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      console.error("Error fetching a user using username:", error);
      throw new Error("Could not fetch user details.");
    }
  }

  //Fetch a user using their email
  async fetchUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      console.error("Error fetching a user using email:", error);
      throw new Error("Could not fetch user details.");
    }
  }

  // Fetch a user with all details
  async fetchUserWithDetails(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          Profile: true,
          Deposits: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Withdrawals: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Referrals: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Bonuses: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Penalties: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Earnings: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Investments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching a user with all details:", error);
      throw new Error("Could not fetch user details.");
    }
  }

  // Fetch all users
  async fetchAllUsers() {
    try {
      return await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Could not fetch all users.");
    }
  }

  // Delete a user account
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

export default new UserService();
