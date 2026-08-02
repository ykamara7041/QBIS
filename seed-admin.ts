import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const envUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || '';
  const connectionString = envUrl.replace("?sslmode=require", "").replace("&sslmode=require", "");
  
  const pool = new pg.Pool({
    connectionString,
    ssl: envUrl.includes("localhost") ? false : { rejectUnauthorized: false }
  });
  
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });

  console.log("Seeding permanent admin account...");

  const adminEmail = "admin@demo.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or find the Admin user
  let adminUser = await db.user.findUnique({ where: { email: adminEmail } });
  
  if (!adminUser) {
    adminUser = await db.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        passwordHash: hashedPassword,
      }
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    // Update password just in case
    adminUser = await db.user.update({
      where: { email: adminEmail },
      data: { passwordHash: hashedPassword, name: "Super Admin" }
    });
    console.log(`Updated existing admin user: ${adminEmail}`);
  }

  // 2. Create a default Organization if none exists
  let org = await db.organization.findFirst();
  if (!org) {
    org = await db.organization.create({
      data: {
        name: "Qbix Headquarters",
        defaultCurrency: "GNF",
      }
    });
    console.log(`Created default organization: ${org.name}`);
  }

  // 3. Assign SUPER_ADMIN role to this user for the organization
  const existingMembership = await db.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: org.id
      }
    }
  });

  if (!existingMembership) {
    await db.organizationMember.create({
      data: {
        userId: adminUser.id,
        organizationId: org.id,
        role: "SUPER_ADMIN",
        isActive: true
      }
    });
    console.log("Granted SUPER_ADMIN access to the admin user.");
  } else {
    await db.organizationMember.update({
      where: { id: existingMembership.id },
      data: { role: "SUPER_ADMIN" }
    });
    console.log("Updated existing membership to SUPER_ADMIN.");
  }

  console.log("==================================================");
  console.log("SUCCESS! You can now log in with:");
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${password}`);
  console.log("==================================================");

  await db.$disconnect();
  process.exit(0);
}

main().catch(console.error);
