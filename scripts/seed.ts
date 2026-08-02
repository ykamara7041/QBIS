import { db } from "../src/lib/db"
import bcrypt from "bcryptjs"
import "dotenv/config"

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // Create admin user
  const admin = await db.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      passwordHash,
    },
  })

  // Create normal user
  const user = await db.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      name: 'Normal User',
      passwordHash,
    },
  })

  // Create an organization for demo
  const org = await db.organization.create({
    data: {
      name: 'Demo Organization',
      country: 'Guinea',
      defaultCurrency: 'GNF',
      members: {
        create: [
          {
            userId: admin.id,
            role: 'SUPER_ADMIN',
          },
          {
            userId: user.id,
            role: 'DATA_ENTRY',
          }
        ]
      }
    }
  })

  console.log("Demo accounts created:")
  console.log(`Admin -> Email: admin@demo.com | Password: password123`)
  console.log(`User -> Email: user@demo.com | Password: password123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
