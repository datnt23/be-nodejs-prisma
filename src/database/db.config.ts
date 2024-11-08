import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient({
  log: ["query"],
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database successfully!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { main, prisma };
