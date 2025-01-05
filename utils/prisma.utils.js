import { PrismaClient } from "@prisma/client";

let prisma;

if (typeof global !== "undefined" && typeof global.prisma !== "undefined") {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient({ log: ["query"] });
  if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
    global.prisma = prisma;
  }
}

export { prisma };