const path = require("path");
const pg = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const prismaPath = path.join(process.cwd(), "app", "generated", "prisma");
const { PrismaClient } = require(prismaPath);
const bcrypt = require("bcryptjs");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const hashedPassword = await bcrypt.hash("Admin@2026", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@asasforeducation.com" },
    update: {},
    create: {
      email: "admin@asasforeducation.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "ASAS",
      role: "ADMIN",
      phone: "+212600000000",
    },
  });
  console.log("Admin created:", admin.email);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });