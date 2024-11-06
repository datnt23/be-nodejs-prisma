import { PrismaClient } from "@prisma/client";
import { roles } from "../src/auth/constants";
import bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

async function seeder() {
  const user = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: await bcrypt.hash("12345678", 10),
      roles: [roles.ADMIN],
      firstName: "Super",
      lastName: "Admin",
      fullName: "Super Admin",
    },
  });
  console.log({ user });
}

seeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
