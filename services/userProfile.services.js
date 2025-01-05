import { prisma } from "../utils/prisma.utils.js";

class UserProfileService {

  // Create a new user profile
  async newUserProfile(data) {
    console.log(data)
    try {
      return await prisma.userProfile.create({
        data,
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Could not create user profile.");
    }
  }

  //Edit a user profile
  async editUserProfile(userId, data) {
    try {
      return await prisma.userProfile.update({
        where: {
          userId,
        },
        data
      });
    } catch (error) {
      console.error("Error editing user profile:", error);
      throw new Error("Could not edit user profile.");
    }
  }

  // Fetch the user profile for a specific user
  async fetchUserProfile(userId) {
    try {
      return await prisma.userProfile.findUnique({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Could not fetch profile.");
    }
  }
}


export default new UserProfileService()