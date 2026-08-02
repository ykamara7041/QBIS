import { PrismaClient } from "@prisma/client"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  // Use non-pooling URL because pg.Pool itself handles pooling. 
  // Using the Supabase transaction pooler (port 6543) with pg.Pool causes connection issues.
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
  const pool = new pg.Pool({
    connectionString,
    ...(connectionString?.includes("sslmode=require") ? { ssl: { rejectUnauthorized: false } } : {})
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db
