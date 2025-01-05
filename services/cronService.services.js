import { prisma } from "../utils/prisma.utils.js";

export class CronJobService {
  async runDailyInvestmentUpdates() {
    console.log("Running daily investment updates...");

    const now = new Date();

    // Fetch investments due for updates
    const dueInvestments = await prisma.investment.findMany({
      where: {
        AND: [
          { status: "running" },
          {
            lastIncrementDate: {
              lte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
          },
          { endDate: { gte: now } },
        ],
      },
    });

    if (dueInvestments) {
      for (const investment of dueInvestments) {
        const dailyIncrement =
          investment.amount * (investment.dailyPercent / 100);
        const updatedAmount = investment.payoutAmount + dailyIncrement;

        // Check if the current date is the end date
        const isLastIncrement =
          investment.endDate.toISOString().split("T")[0] ===
          now.toISOString().split("T")[0];

        // Update payoutAmount, lastIncrementDate, and potentially status
        await prisma.investment.update({
          where: { id: investment.id },
          data: {
            payoutAmount: updatedAmount,
            lastIncrementDate: now,
            ...(isLastIncrement && { status: "completed" }),
          },
        });

        if (isLastIncrement) {
          console.log(`Investment ${investment.id} marked as completed.`);
        }
      }
    }

    console.log("Daily investment updates completed.");
  }
}
