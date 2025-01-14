import { prisma } from "../utils/prisma.utils.js";

export class CronJobService {
  async runDailyInvestmentUpdates() {
    console.log("Running daily investment updates...");

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

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
          { endDate: { lte: now } }, // Check if endDate is today or earlier
        ],
      },
    });

    console.log("Due investments:", dueInvestments);

    if (dueInvestments.length > 0) {
      for (const investment of dueInvestments) {
        const dailyIncrement =
          investment.amount * (investment.dailyPercent / 100);
        const updatedAmount = investment.payoutAmount + dailyIncrement;

        // Check if the current date is the end date or later
        const isLastIncrement =
          new Date(investment.endDate).getTime() <= startOfToday.getTime();

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
        } else {
          console.log(
            `Investment ${investment.id} updated with new payout amount.`
          );
        }
      }
    } else {
      console.log("No investments due for updates.");
    }

    console.log("Daily investment updates completed.");
  }
}
