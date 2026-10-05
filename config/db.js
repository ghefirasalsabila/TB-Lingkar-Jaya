const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;
const PRISMA_GLOBAL_KEY = "__tblingkarjayaPrisma";

const prisma =
  globalForPrisma[PRISMA_GLOBAL_KEY] ||
  new PrismaClient({
    log: ["warn", "error"],
    transactionOptions: {
      maxWait: 10_000,
      timeout: 30_000
    }
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma[PRISMA_GLOBAL_KEY] = prisma;
}

module.exports = prisma;
