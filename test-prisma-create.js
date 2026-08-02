const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Found user:", user?.email);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect()
  }
}
main()
