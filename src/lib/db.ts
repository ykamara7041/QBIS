import { PrismaClient } from "@prisma/client"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  const envUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL || ""
  
  let connectionString = envUrl
  try {
    const url = new URL(envUrl)
    url.searchParams.delete("sslmode")
    url.searchParams.delete("pgbouncer")
    connectionString = url.toString()
  } catch (e) {
    // ignore parse errors
  }
  
  const pool = new pg.Pool({
    connectionString,
    ssl: envUrl.includes("localhost") ? false : { rejectUnauthorized: false }
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal2: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal2 = db
